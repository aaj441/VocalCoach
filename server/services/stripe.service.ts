/**
 * STRIPE SUBSCRIPTION SERVICE
 *
 * Handles all subscription management:
 * - Customer creation
 * - Subscription lifecycle
 * - Webhook processing
 * - Payment tracking
 */

import Stripe from 'stripe';
import { env } from '../config/env.js';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { logInfo, logError } from '../config/logger.js';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export interface SubscriptionTier {
  name: string;
  priceId: string;
  features: string[];
}

export const subscriptionTiers: Record<string, SubscriptionTier> = {
  free: {
    name: 'Free',
    priceId: '',
    features: ['5 AI exercises/month', 'Basic analytics', 'Community support'],
  },
  basic: {
    name: 'Basic',
    priceId: env.STRIPE_PRICE_ID_BASIC || '',
    features: ['Unlimited AI exercises', 'Advanced analytics', 'Priority support', 'Custom challenges'],
  },
  pro: {
    name: 'Pro',
    priceId: env.STRIPE_PRICE_ID_PRO || '',
    features: ['Everything in Basic', '1-on-1 coaching sessions', 'Exclusive content', 'Early access to features'],
  },
};

export class StripeService {
  /**
   * Create or retrieve Stripe customer
   */
  async getOrCreateCustomer(userId: string, email: string, name: string): Promise<string> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId));

      if (user?.stripeCustomerId) {
        return user.stripeCustomerId;
      }

      const customer = await stripe.customers.create({
        email,
        name,
        metadata: { userId },
      });

      await db.update(users)
        .set({ stripeCustomerId: customer.id })
        .where(eq(users.id, userId));

      logInfo('Stripe customer created', { userId, customerId: customer.id });

      return customer.id;
    } catch (error) {
      logError('Failed to create Stripe customer', error, { userId });
      throw error;
    }
  }

  /**
   * Create checkout session
   */
  async createCheckoutSession(params: {
    userId: string;
    email: string;
    name: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<string> {
    try {
      const customerId = await this.getOrCreateCustomer(params.userId, params.email, params.name);

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        line_items: [{ price: params.priceId, quantity: 1 }],
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: { userId: params.userId },
      });

      logInfo('Checkout session created', { userId: params.userId, sessionId: session.id });

      return session.url || '';
    } catch (error) {
      logError('Failed to create checkout session', error, { userId: params.userId });
      throw error;
    }
  }

  /**
   * Create customer portal session
   */
  async createPortalSession(userId: string, returnUrl: string): Promise<string> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId));

      if (!user?.stripeCustomerId) {
        throw new Error('No Stripe customer found');
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: returnUrl,
      });

      logInfo('Portal session created', { userId });

      return session.url;
    } catch (error) {
      logError('Failed to create portal session', error, { userId });
      throw error;
    }
  }

  /**
   * Handle webhook events
   */
  async handleWebhook(signature: string, body: Buffer): Promise<void> {
    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );

      logInfo('Stripe webhook received', { type: event.type });

      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionCancellation(event.data.object as Stripe.Subscription);
          break;

        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;

        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        default:
          logInfo('Unhandled webhook event', { type: event.type });
      }
    } catch (error) {
      logError('Webhook processing failed', error);
      throw error;
    }
  }

  /**
   * Handle subscription update
   */
  private async handleSubscriptionUpdate(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata.userId;

    if (!userId) {
      logError('No userId in subscription metadata', null, { subscriptionId: subscription.id });
      return;
    }

    const tier = this.getTierFromPriceId(subscription.items.data[0]?.price.id);

    await db.update(users)
      .set({
        subscriptionStatus: subscription.status,
        subscriptionTier: tier,
        subscriptionEndDate: new Date(subscription.current_period_end * 1000),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    logInfo('Subscription updated', { userId, tier, status: subscription.status });
  }

  /**
   * Handle subscription cancellation
   */
  private async handleSubscriptionCancellation(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata.userId;

    if (!userId) return;

    await db.update(users)
      .set({
        subscriptionStatus: 'canceled',
        subscriptionTier: 'free',
        subscriptionEndDate: new Date(subscription.current_period_end * 1000),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    logInfo('Subscription canceled', { userId });
  }

  /**
   * Handle successful payment
   */
  private async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    logInfo('Payment succeeded', {
      customerId: invoice.customer,
      amount: invoice.amount_paid
    });
  }

  /**
   * Handle failed payment
   */
  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    logError('Payment failed', null, {
      customerId: invoice.customer,
      amount: invoice.amount_due
    });
  }

  /**
   * Get tier from price ID
   */
  private getTierFromPriceId(priceId?: string): string {
    if (!priceId) return 'free';

    if (priceId === env.STRIPE_PRICE_ID_BASIC) return 'basic';
    if (priceId === env.STRIPE_PRICE_ID_PRO) return 'pro';

    return 'free';
  }

  /**
   * Check if user has active subscription
   */
  async hasActiveSubscription(userId: string): Promise<boolean> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) return false;

    if (user.subscriptionTier === 'free') return true;

    if (!user.subscriptionEndDate) return false;

    return user.subscriptionEndDate > new Date() && user.subscriptionStatus === 'active';
  }

  /**
   * Cancel user subscription
   */
  async cancelSubscription(userId: string): Promise<void> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId));

      if (!user || !user.stripeCustomerId) {
        throw new Error('No subscription found');
      }

      // Get active subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'active',
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        // Cancel at period end
        await stripe.subscriptions.update(subscriptions.data[0].id, {
          cancel_at_period_end: true,
        });

        logInfo('Subscription cancelled', { userId, subscriptionId: subscriptions.data[0].id });
      }
    } catch (error) {
      logError('Failed to cancel subscription', error, { userId });
      throw error;
    }
  }
}

export const stripeService = new StripeService();
