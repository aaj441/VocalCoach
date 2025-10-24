/**
 * AUTHENTICATION SERVICE
 *
 * Handles user authentication:
 * - Registration
 * - Login
 * - JWT token generation
 * - Password hashing
 */

import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users, userProfiles } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { env } from '../config/env.js';
import { logInfo, logError } from '../config/logger.js';

interface TokenPayload {
  userId: string;
  email: string;
}

export class AuthService {
  /**
   * Register new user
   */
  async register(email: string, password: string, name: string): Promise<{
    user: any;
    token: string;
  }> {
    try {
      // Check if user exists
      const existingUser = await db.select().from(users).where(eq(users.email, email));

      if (existingUser.length > 0) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const [newUser] = await db.insert(users).values({
        email,
        password: hashedPassword,
        name,
      }).returning();

      // Create user profile with default values
      await db.insert(userProfiles).values({
        userId: newUser.id,
        avatar: {
          skin: 'light',
          hair: 'short-brown',
          outfit: 'casual',
          accessory: 'none',
          unlocked: ['light', 'short-brown', 'casual', 'none'],
        },
        vocalStats: {
          pitchAccuracy: 50,
          resonance: 50,
          clarity: 50,
          volumeControl: 50,
          range: { lowest: 196, highest: 392 },
        },
      });

      // Generate token
      const token = this.generateToken({ userId: newUser.id, email: newUser.email });

      logInfo('User registered', { userId: newUser.id, email });

      return {
        user: this.sanitizeUser(newUser),
        token,
      };
    } catch (error) {
      logError('Registration failed', error, { email });
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<{
    user: any;
    token: string;
  }> {
    try {
      // Find user
      const [user] = await db.select().from(users).where(eq(users.email, email));

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await db.update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, user.id));

      // Generate token
      const token = this.generateToken({ userId: user.id, email: user.email });

      logInfo('User logged in', { userId: user.id, email });

      return {
        user: this.sanitizeUser(user),
        token,
      };
    } catch (error) {
      logError('Login failed', error, { email });
      throw error;
    }
  }

  /**
   * Generate JWT token
   */
  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as string,
    } as SignOptions);
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<any> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Remove sensitive data from user object
   */
  private sanitizeUser(user: any) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}

export const authService = new AuthService();
