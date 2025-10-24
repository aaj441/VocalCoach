/**
 * AUTHENTICATION ROUTES
 *
 * Endpoints for user authentication and management
 */

import { Router, Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware.js';
import { logInfo, logError } from '../config/logger.js';
import { z } from 'zod';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Register new user
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors,
      });
    }

    const { email, password, name } = validation.data;

    const result = await authService.register(email, password, name);

    logInfo('User registered successfully', { userId: result.user.id, email });

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'User already exists') {
      return res.status(409).json({ error: 'User already exists' });
    }

    logError('Registration failed', error, { email: req.body.email });
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * Login user
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors,
      });
    }

    const { email, password } = validation.data;

    const result = await authService.login(email, password);

    logInfo('User logged in successfully', { userId: result.user.id, email });

    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid credentials') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    logError('Login failed', error, { email: req.body.email });
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * Get current user
 * GET /api/auth/me
 */
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await authService.getUserById(req.user.userId);

    res.json({ user });
  } catch (error) {
    logError('Failed to get user', error, { userId: req.user?.userId });
    res.status(500).json({ error: 'Failed to get user' });
  }
});

/**
 * Verify token
 * POST /api/auth/verify
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const payload = authService.verifyToken(token);

    res.json({ valid: true, payload });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
});

/**
 * Refresh token
 * POST /api/auth/refresh
 */
router.post('/refresh', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Generate new token
    const token = authService.generateToken({
      userId: req.user.userId,
      email: req.user.email,
    });

    res.json({ token });
  } catch (error) {
    logError('Token refresh failed', error, { userId: req.user?.userId });
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

export default router;
