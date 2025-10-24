/**
 * VOCAL TRAINING ROUTES
 *
 * Endpoints for AI-powered vocal training and practice
 */

import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware.js';
import { vocalAgent } from '../agents/vocalAgent.js';
import { db } from '../db/index.js';
import { userProfiles, practiceSessions, aiExercises, challenges } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { logInfo, logError } from '../config/logger.js';
import { z } from 'zod';

const router = Router();

// All vocal routes require authentication
router.use(authMiddleware);

// Validation schemas
const sessionSchema = z.object({
  type: z.enum(['song', 'exercise', 'challenge', 'mini-game']),
  duration: z.number().min(1, 'Duration must be at least 1 second'),
  stats: z.object({
    pitchAccuracy: z.number().min(0).max(100),
    resonance: z.number().min(0).max(100),
    clarity: z.number().min(0).max(100),
    volumeControl: z.number().min(0).max(100),
  }),
});

/**
 * Get user profile with stats
 * GET /api/vocal/profile
 */
router.get('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    logError('Failed to get profile', error, { userId: req.user?.userId });
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

/**
 * Generate personalized exercise
 * POST /api/vocal/exercise/generate
 */
router.post('/exercise/generate', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const exercise = await vocalAgent.generatePersonalizedExercise(userId);

    logInfo('Exercise generated', { userId, exerciseId: exercise.id });

    res.json({ exercise });
  } catch (error) {
    logError('Failed to generate exercise', error, { userId: req.user?.userId });
    res.status(500).json({ error: 'Failed to generate exercise' });
  }
});

/**
 * Get user exercises
 * GET /api/vocal/exercises
 */
router.get('/exercises', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const exercises = await db
      .select()
      .from(aiExercises)
      .where(eq(aiExercises.userId, userId))
      .orderBy(desc(aiExercises.createdAt))
      .limit(20);

    res.json({ exercises });
  } catch (error) {
    logError('Failed to get exercises', error, { userId: req.user?.userId });
    res.status(500).json({ error: 'Failed to get exercises' });
  }
});

/**
 * Submit practice session
 * POST /api/vocal/session
 */
router.post('/session', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    // Validate request body
    const validation = sessionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors,
      });
    }

    const sessionData = {
      userId,
      ...validation.data,
    };

    // Analyze session with AI
    const analysis = await vocalAgent.analyzeSession(sessionData);

    logInfo('Session analyzed', {
      userId,
      type: sessionData.type,
      xpGained: analysis.xpGained,
    });

    res.json(analysis);
  } catch (error) {
    logError('Failed to analyze session', error, { userId: req.user?.userId });
    res.status(500).json({ error: 'Failed to analyze session' });
  }
});

/**
 * Get practice history
 * GET /api/vocal/sessions
 */
router.get('/sessions', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const limit = parseInt(req.query.limit as string) || 20;

    const sessions = await db
      .select()
      .from(practiceSessions)
      .where(eq(practiceSessions.userId, userId))
      .orderBy(desc(practiceSessions.createdAt))
      .limit(limit);

    res.json({ sessions });
  } catch (error) {
    logError('Failed to get sessions', error, { userId: req.user?.userId });
    res.status(500).json({ error: 'Failed to get sessions' });
  }
});

/**
 * Get daily challenges
 * GET /api/vocal/challenges/daily
 */
router.get('/challenges/daily', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    let dailyChallenges = await db
      .select()
      .from(challenges)
      .where(
        and(
          eq(challenges.userId, userId),
          eq(challenges.type, 'daily'),
          eq(challenges.completed, false)
        )
      );

    // Generate challenges if none exist
    if (dailyChallenges.length === 0) {
      dailyChallenges = await vocalAgent.generateDailyChallenges(userId);
    }

    res.json({ challenges: dailyChallenges });
  } catch (error) {
    logError('Failed to get daily challenges', error, { userId: req.user?.userId });
    res.status(500).json({ error: 'Failed to get daily challenges' });
  }
});

/**
 * Get all challenges
 * GET /api/vocal/challenges
 */
router.get('/challenges', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const allChallenges = await db
      .select()
      .from(challenges)
      .where(eq(challenges.userId, userId))
      .orderBy(desc(challenges.createdAt))
      .limit(50);

    res.json({ challenges: allChallenges });
  } catch (error) {
    logError('Failed to get challenges', error, { userId: req.user?.userId });
    res.status(500).json({ error: 'Failed to get challenges' });
  }
});

/**
 * Complete challenge
 * POST /api/vocal/challenges/:id/complete
 */
router.post('/challenges/:id/complete', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const challengeId = req.params.id;

    // Verify challenge belongs to user
    const [challenge] = await db
      .select()
      .from(challenges)
      .where(and(eq(challenges.id, challengeId), eq(challenges.userId, userId)));

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    if (challenge.completed) {
      return res.status(400).json({ error: 'Challenge already completed' });
    }

    // Mark as completed
    await db
      .update(challenges)
      .set({
        completed: true,
        completedAt: new Date(),
        progress: challenge.goal,
      })
      .where(eq(challenges.id, challengeId));

    // Award reward (XP or item)
    if (challenge.reward.type === 'xp') {
      const [profile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId));

      if (profile) {
        const newXP = profile.xp + Number(challenge.reward.value);
        const newLevel = Math.floor(newXP / 1000) + 1;

        await db
          .update(userProfiles)
          .set({
            xp: newXP,
            level: newLevel,
            totalPoints: profile.totalPoints + Number(challenge.reward.value),
          })
          .where(eq(userProfiles.userId, userId));
      }
    }

    logInfo('Challenge completed', { userId, challengeId });

    res.json({ success: true, reward: challenge.reward });
  } catch (error) {
    logError('Failed to complete challenge', error, {
      userId: req.user?.userId,
      challengeId: req.params.id,
    });
    res.status(500).json({ error: 'Failed to complete challenge' });
  }
});

/**
 * Get health intervention status
 * GET /api/vocal/health
 */
router.get('/health', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const health = await vocalAgent.monitorUserHealth(userId);

    res.json(health);
  } catch (error) {
    logError('Failed to check user health', error, { userId: req.user?.userId });
    res.status(500).json({ error: 'Failed to check user health' });
  }
});

export default router;
