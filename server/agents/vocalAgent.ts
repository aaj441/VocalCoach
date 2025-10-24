/**
 * VOCAL TRAINING AGENT
 *
 * Autonomous AI agent for VocalCoach that provides:
 * - AI-powered vocal exercise generation
 * - Adaptive difficulty progression
 * - Real-time performance analysis
 * - Personalized feedback
 * - ADHD-friendly gamification
 * - Health monitoring and intervention
 */

import OpenAI from 'openai';
import { env } from '../config/env.js';
import { db } from '../db/index.js';
import { aiExercises, practiceSessions, userProfiles, challenges } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { logInfo, logError } from '../config/logger.js';

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

interface VocalStats {
  pitchAccuracy: number;
  resonance: number;
  clarity: number;
  volumeControl: number;
}

interface UserContext {
  userId: string;
  level: number;
  vocalStats: VocalStats;
  recentSessions: any[];
  currentChallenges: any[];
}

export class VocalAgent {
  private static instance: VocalAgent;

  private constructor() {}

  static getInstance(): VocalAgent {
    if (!VocalAgent.instance) {
      VocalAgent.instance = new VocalAgent();
    }
    return VocalAgent.instance;
  }

  /**
   * Generate personalized vocal exercise using AI
   */
  async generatePersonalizedExercise(userId: string): Promise<any> {
    try {
      logInfo('Generating personalized exercise', { userId });

      // Get user context
      const context = await this.getUserContext(userId);

      // Identify weakest skill
      const weakestSkill = this.identifyWeakestSkill(context.vocalStats);

      // Generate exercise using OpenAI
      const exercise = await this.generateExerciseWithAI(context, weakestSkill);

      // Save to database
      const [savedExercise] = await db.insert(aiExercises).values({
        userId,
        type: weakestSkill,
        difficulty: this.calculateDifficulty(context.level),
        title: exercise.title,
        description: exercise.description,
        instructions: exercise.instructions,
        targetMetrics: exercise.targetMetrics,
        duration: exercise.duration,
      }).returning();

      logInfo('Exercise generated successfully', { exerciseId: savedExercise.id, userId });

      return savedExercise;
    } catch (error) {
      logError('Failed to generate exercise', error, { userId });
      throw error;
    }
  }

  /**
   * Analyze practice session and provide feedback
   */
  async analyzeSession(sessionData: {
    userId: string;
    type: string;
    duration: number;
    stats: VocalStats;
  }): Promise<{ feedback: string[]; improvements: string[]; xpGained: number }> {
    try {
      logInfo('Analyzing practice session', { userId: sessionData.userId });

      const context = await this.getUserContext(sessionData.userId);

      // Calculate score
      const score = this.calculateScore(sessionData.stats);

      // Calculate XP based on performance
      const xpGained = this.calculateXP(score, sessionData.duration, context.level);

      // Generate AI feedback
      const feedback = await this.generateFeedback(sessionData, context);

      // Identify improvements
      const improvements = this.identifyImprovements(sessionData.stats, context.vocalStats);

      // Save session
      await db.insert(practiceSessions).values({
        userId: sessionData.userId,
        type: sessionData.type,
        duration: sessionData.duration,
        score,
        stats: sessionData.stats,
        improvements,
      });

      // Update user profile
      await this.updateUserProgress(sessionData.userId, {
        xp: xpGained,
        stats: sessionData.stats,
      });

      // Check for achievements
      await this.checkAchievements(sessionData.userId, sessionData);

      logInfo('Session analyzed successfully', { userId: sessionData.userId, score, xpGained });

      return { feedback, improvements, xpGained };
    } catch (error) {
      logError('Failed to analyze session', error, { userId: sessionData.userId });
      throw error;
    }
  }

  /**
   * Generate daily challenges
   */
  async generateDailyChallenges(userId: string): Promise<any[]> {
    try {
      logInfo('Generating daily challenges', { userId });

      const context = await this.getUserContext(userId);

      // Delete expired challenges
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      await db.delete(challenges).where(
        and(
          eq(challenges.userId, userId),
          eq(challenges.type, 'daily')
        )
      );

      // Generate new challenges
      const challengeTemplates = [
        {
          title: '15-Minute Practice',
          description: 'Practice for 15 minutes today',
          type: 'daily',
          difficulty: 'easy',
          goal: 15 * 60, // 15 minutes in seconds
          reward: { type: 'xp', value: 100, name: '100 XP' },
        },
        {
          title: 'Pitch Perfect',
          description: `Achieve ${70 + context.level * 2}% pitch accuracy`,
          type: 'daily',
          difficulty: 'medium',
          goal: 70 + context.level * 2,
          reward: { type: 'xp', value: 150, name: '150 XP' },
        },
        {
          title: 'Streak Master',
          description: 'Practice today to maintain your streak',
          type: 'daily',
          difficulty: 'easy',
          goal: 1,
          reward: { type: 'xp', value: 50, name: '50 XP' },
        },
      ];

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const newChallenges = await db.insert(challenges).values(
        challengeTemplates.map((template) => ({
          userId,
          ...template,
          expiresAt: tomorrow,
        }))
      ).returning();

      logInfo('Daily challenges generated', { userId, count: newChallenges.length });

      return newChallenges;
    } catch (error) {
      logError('Failed to generate daily challenges', error, { userId });
      throw error;
    }
  }

  /**
   * Health monitoring - Check if user needs intervention
   */
  async monitorUserHealth(userId: string): Promise<{ needsIntervention: boolean; message?: string }> {
    try {
      const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));

      if (!profile) {
        return { needsIntervention: false };
      }

      // Check if user hasn't practiced in 3 days
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      if (profile.lastPracticeDate && profile.lastPracticeDate < threeDaysAgo) {
        return {
          needsIntervention: true,
          message: "We miss you! Your vocal progress is waiting. Try a quick 5-minute warmup?",
        };
      }

      // Check if streak is at risk (ADHD-friendly intervention)
      if (profile.streak > 5) {
        const today = new Date().toDateString();
        const lastPractice = profile.lastPracticeDate?.toDateString();

        if (lastPractice !== today) {
          return {
            needsIntervention: true,
            message: `Your ${profile.streak}-day streak is at risk! Don't break the chain - practice for just 5 minutes today!`,
          };
        }
      }

      return { needsIntervention: false };
    } catch (error) {
      logError('Failed to monitor user health', error, { userId });
      return { needsIntervention: false };
    }
  }

  // ==================== PRIVATE HELPER METHODS ====================

  private async getUserContext(userId: string): Promise<UserContext> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));

    if (!profile) {
      throw new Error('User profile not found');
    }

    const recentSessions = await db
      .select()
      .from(practiceSessions)
      .where(eq(practiceSessions.userId, userId))
      .orderBy(desc(practiceSessions.createdAt))
      .limit(10);

    const currentChallenges = await db
      .select()
      .from(challenges)
      .where(and(eq(challenges.userId, userId), eq(challenges.completed, false)));

    return {
      userId,
      level: profile.level,
      vocalStats: profile.vocalStats,
      recentSessions,
      currentChallenges,
    };
  }

  private identifyWeakestSkill(stats: VocalStats): string {
    const skills = {
      pitch: stats.pitchAccuracy,
      resonance: stats.resonance,
      clarity: stats.clarity,
      volume: stats.volumeControl,
    };

    return Object.entries(skills).reduce((weakest, [skill, value]) =>
      value < skills[weakest as keyof typeof skills] ? skill : weakest
    ) as string;
  }

  private calculateDifficulty(level: number): string {
    if (level < 5) return 'beginner';
    if (level < 10) return 'intermediate';
    return 'advanced';
  }

  private async generateExerciseWithAI(context: UserContext, targetSkill: string): Promise<any> {
    const prompt = `Generate a personalized vocal exercise for a user with the following profile:
- Level: ${context.level}
- Target Skill: ${targetSkill}
- Current Stats: ${JSON.stringify(context.vocalStats)}

Create a ${this.calculateDifficulty(context.level)} level exercise that focuses on improving ${targetSkill}.

Return a JSON object with:
{
  "title": "Engaging Exercise Title",
  "description": "Brief description",
  "instructions": ["Step 1", "Step 2", "Step 3"],
  "targetMetrics": { "${targetSkill}": target_value },
  "duration": duration_in_seconds
}

Make it ADHD-friendly: short, engaging, with clear steps.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert vocal coach AI that creates personalized, engaging vocal exercises.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  private calculateScore(stats: VocalStats): number {
    return Math.round(
      stats.pitchAccuracy * 0.4 +
      stats.resonance * 0.2 +
      stats.clarity * 0.2 +
      stats.volumeControl * 0.2
    );
  }

  private calculateXP(score: number, duration: number, level: number): number {
    const baseXP = score;
    const durationBonus = Math.floor(duration / 60) * 10; // 10 XP per minute
    const levelMultiplier = 1 + (level * 0.1);
    return Math.round((baseXP + durationBonus) * levelMultiplier);
  }

  private async generateFeedback(sessionData: any, context: UserContext): Promise<string[]> {
    const feedback: string[] = [];

    // Pitch feedback
    if (sessionData.stats.pitchAccuracy > 80) {
      feedback.push("Excellent pitch control! You're hitting those notes with precision!");
    } else if (sessionData.stats.pitchAccuracy < 50) {
      feedback.push("Focus on pitch accuracy. Try the siren exercise to improve your pitch control.");
    }

    // Resonance feedback
    if (sessionData.stats.resonance > 75) {
      feedback.push("Great vocal resonance! Your voice sounds full and rich.");
    }

    // Clarity feedback
    if (sessionData.stats.clarity < 60) {
      feedback.push("Work on articulation. Tongue twisters can help improve clarity.");
    }

    // Duration-based feedback (ADHD-friendly encouragement)
    if (sessionData.duration >= 15 * 60) {
      feedback.push("Amazing focus! 15+ minutes of practice shows real dedication.");
    }

    return feedback;
  }

  private identifyImprovements(currentStats: VocalStats, previousStats: VocalStats): string[] {
    const improvements: string[] = [];

    const compare = (current: number, previous: number, skill: string) => {
      if (current > previous + 5) {
        improvements.push(`${skill} improved by ${Math.round(current - previous)}%`);
      }
    };

    compare(currentStats.pitchAccuracy, previousStats.pitchAccuracy, 'Pitch accuracy');
    compare(currentStats.resonance, previousStats.resonance, 'Resonance');
    compare(currentStats.clarity, previousStats.clarity, 'Clarity');
    compare(currentStats.volumeControl, previousStats.volumeControl, 'Volume control');

    return improvements;
  }

  private async updateUserProgress(userId: string, update: { xp: number; stats: VocalStats }) {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));

    if (!profile) return;

    const newXP = profile.xp + update.xp;
    const newLevel = Math.floor(newXP / 1000) + 1;

    // Update stats (weighted average)
    const updatedStats = {
      pitchAccuracy: (profile.vocalStats.pitchAccuracy * 0.7 + update.stats.pitchAccuracy * 0.3),
      resonance: (profile.vocalStats.resonance * 0.7 + update.stats.resonance * 0.3),
      clarity: (profile.vocalStats.clarity * 0.7 + update.stats.clarity * 0.3),
      volumeControl: (profile.vocalStats.volumeControl * 0.7 + update.stats.volumeControl * 0.3),
      range: profile.vocalStats.range,
    };

    await db.update(userProfiles)
      .set({
        xp: newXP,
        level: newLevel,
        totalPoints: profile.totalPoints + update.xp,
        vocalStats: updatedStats,
        lastPracticeDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, userId));
  }

  private async checkAchievements(userId: string, sessionData: any) {
    // Check if any challenges are completed
    // This would update challenge progress and award badges
    // Implementation depends on specific achievement logic
  }
}

// Export singleton instance
export const vocalAgent = VocalAgent.getInstance();
