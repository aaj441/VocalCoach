/**
 * SUBSCRIPTION ROUTES
 *
 * Endpoints for Stripe subscription management
 */

import { Router, Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware.js';
import { stripeService } from '../services/stripe.service.js';
import { env } from '../config/env.js';
import { logInfo, logError } from '../config/logger.js';
import { z } from 'zod';

const router = Router();

// Validation schemas
const checkoutSchema = z.object({
  tier: z.enum(['basic', 'pro', 'premium']),
  billingPeriod: z.enum(['monthly', 'yearly']),
});

/**
 * Create checkout session
 * POST /api/subscription/checkout
 */
router.post('/checkout', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const email = req.user!.email;

    // Validate request body
    const validation = checkoutSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors,
      });
    }

    const { tier, billingPeriod } = validation.data;

    // Get price ID from tier
    let priceId = env.STRIPE_PRICE_ID_BASIC;
    if (tier === 'pro') priceId = env.STRIPE_PRICE_ID_PRO;
    if (tier === 'premium') priceId = env.STRIPE_PRICE_ID_PREMIUM;

    if (!priceId) {
      return res.status(400).json({ error: 'Invalid tier or missing price configuration' });
    }

    const sessionUrl = await stripeService.createCheckoutSession({
      userId,
      email,
      name: email,
      priceId,
      successUrl: `${env.FRONTEND_URL}/subscription/success`,
      cancelUrl: `${env.FRONTEND_URL}/subscription/cancel`,
    });

    logInfo('Checkout session created', { userId, tier, billingPeriod });

    res.json({ url: sessionUrl });
  } catch (error) {
    logError('Failed to create checkout session', error, { userId: req.user?.userId });
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

/**
 * Create customer portal session
 * POST /api/subscription/portal
 */
router.post('/portal', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const portalUrl = await stripeService.createPortalSession(
      userId,
      `${env.FRONTEND_URL}/settings`
    );

    logInfo('Customer portal session created', { userId });

    res.json({ url: portalUrl });
  } catch (error) {
    logError('Failed to create customer portal session', error, { userId: req.user?.userId });
    res.status(500).json({ error: 'Failed to create customer portal session' });
  }
});

/**
 * Get subscription status
 * GET /api/subscription/status
 */
router.get('/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const hasSubscription = await stripeService.hasActiveSubscription(userId);

    res.json({ hasActiveSubscription: hasSubscription });
  } catch (error) {
    logError('Failed to get subscription status', error, { userId: req.user?.userId });
    res.status(500).json({ error: 'Failed to get subscription status' });
  }
});

/**
 * Cancel subscription
 * POST /api/subscription/cancel
 */
router.post('/cancel', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    await stripeService.cancelSubscription(userId);

    logInfo('Subscription cancelled', { userId });

    res.json({ success: true });
  } catch (error) {
    logError('Failed to cancel subscription', error, { userId: req.user?.userId });
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

/**
 * Stripe webhook handler
 * POST /api/subscription/webhook
 *
 * This endpoint must NOT have auth middleware
 * Stripe signature verification is handled inside
 */
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    // req.body must be raw buffer for signature verification
    await stripeService.handleWebhook(signature, req.body);

    res.json({ received: true });
  } catch (error) {
    logError('Webhook processing failed', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

export default router;
