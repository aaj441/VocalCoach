/**
 * JOB SCHEDULER
 *
 * Autonomous job scheduler for VocalCoach:
 * - Daily challenge generation for all users
 * - User health monitoring and intervention
 * - Database backups
 * - Analytics aggregation
 * - System health checks
 */

import cron from 'node-cron';
import { db } from '../db/index.js';
import { users, userProfiles, healthLogs } from '../db/schema.js';
import { vocalAgent } from '../agents/vocalAgent.js';
import { logInfo, logError } from '../config/logger.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { env } from '../config/env.js';

const execAsync = promisify(exec);

export class JobScheduler {
  private static instance: JobScheduler;
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  private constructor() {}

  static getInstance(): JobScheduler {
    if (!JobScheduler.instance) {
      JobScheduler.instance = new JobScheduler();
    }
    return JobScheduler.instance;
  }

  /**
   * Start all scheduled jobs
   */
  start() {
    logInfo('Starting job scheduler...');

    // Daily challenges generation (runs at 12:00 AM every day)
    this.scheduleJob('dailyChallenges', '0 0 * * *', this.generateDailyChallenges.bind(this));

    // User health monitoring (runs every 6 hours)
    this.scheduleJob('healthMonitoring', '0 */6 * * *', this.monitorUserHealth.bind(this));

    // Database backup (runs at 3:00 AM every day)
    this.scheduleJob('databaseBackup', '0 3 * * *', this.backupDatabase.bind(this));

    // System health check (runs every 15 minutes)
    this.scheduleJob('systemHealth', '*/15 * * * *', this.checkSystemHealth.bind(this));

    // Weekly analytics aggregation (runs at 1:00 AM every Monday)
    this.scheduleJob('weeklyAnalytics', '0 1 * * 1', this.aggregateWeeklyAnalytics.bind(this));

    logInfo('Job scheduler started successfully', {
      jobs: Array.from(this.jobs.keys()),
    });
  }

  /**
   * Stop all scheduled jobs
   */
  stop() {
    logInfo('Stopping job scheduler...');

    for (const [name, task] of this.jobs.entries()) {
      task.stop();
      logInfo(`Stopped job: ${name}`);
    }

    this.jobs.clear();
    logInfo('Job scheduler stopped');
  }

  /**
   * Schedule a job
   */
  private scheduleJob(name: string, schedule: string, handler: () => Promise<void>) {
    const task = cron.schedule(schedule, async () => {
      const startTime = Date.now();
      logInfo(`Starting job: ${name}`);

      try {
        await handler();
        const duration = Date.now() - startTime;
        logInfo(`Job completed: ${name}`, { duration });
      } catch (error) {
        const duration = Date.now() - startTime;
        logError(`Job failed: ${name}`, error, { duration });
      }
    });

    this.jobs.set(name, task);
    logInfo(`Scheduled job: ${name}`, { schedule });
  }

  // ==================== JOB HANDLERS ====================

  /**
   * Generate daily challenges for all users
   */
  private async generateDailyChallenges() {
    logInfo('Generating daily challenges for all users');

    try {
      const allUsers = await db.select({ id: users.id }).from(users);

      let successCount = 0;
      let errorCount = 0;

      for (const user of allUsers) {
        try {
          await vocalAgent.generateDailyChallenges(user.id);
          successCount++;
        } catch (error) {
          logError('Failed to generate challenges for user', error, { userId: user.id });
          errorCount++;
        }
      }

      logInfo('Daily challenges generation completed', {
        totalUsers: allUsers.length,
        successCount,
        errorCount,
      });
    } catch (error) {
      logError('Daily challenges generation job failed', error);
      throw error;
    }
  }

  /**
   * Monitor user health and send interventions
   */
  private async monitorUserHealth() {
    logInfo('Monitoring user health');

    try {
      const allUsers = await db.select({ id: users.id }).from(users);

      let interventionCount = 0;

      for (const user of allUsers) {
        try {
          const health = await vocalAgent.monitorUserHealth(user.id);

          if (health.needsIntervention) {
            // In production, this would send push notification or email
            logInfo('User needs intervention', {
              userId: user.id,
              message: health.message,
            });
            interventionCount++;
          }
        } catch (error) {
          logError('Failed to monitor user health', error, { userId: user.id });
        }
      }

      logInfo('User health monitoring completed', {
        totalUsers: allUsers.length,
        interventionCount,
      });
    } catch (error) {
      logError('User health monitoring job failed', error);
      throw error;
    }
  }

  /**
   * Backup database
   */
  private async backupDatabase() {
    logInfo('Starting database backup');

    try {
      if (env.NODE_ENV !== 'production') {
        logInfo('Skipping database backup in non-production environment');
        return;
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = `backup_${timestamp}.sql`;

      // pg_dump command (requires DATABASE_URL to be set)
      const command = `pg_dump ${env.DATABASE_URL} > /backups/${backupFile}`;

      await execAsync(command);

      logInfo('Database backup completed', { backupFile });

      // Optional: Upload to cloud storage (S3, etc.)
      // await this.uploadBackupToCloud(backupFile);
    } catch (error) {
      logError('Database backup job failed', error);
      throw error;
    }
  }

  /**
   * Check system health and log metrics
   */
  private async checkSystemHealth() {
    try {
      const uptime = process.uptime();
      const memoryUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();

      // Test database connection
      let dbStatus = 'healthy';
      try {
        await db.select().from(users).limit(1);
      } catch (error) {
        dbStatus = 'unhealthy';
        logError('Database health check failed', error);
      }

      // Log health metrics
      await db.insert(healthLogs).values({
        status: dbStatus === 'healthy' ? 'healthy' : 'degraded',
        uptime: Math.floor(uptime),
        memoryUsage: {
          rss: memoryUsage.rss,
          heapTotal: memoryUsage.heapTotal,
          heapUsed: memoryUsage.heapUsed,
          external: memoryUsage.external,
        },
        cpuUsage: {
          user: cpuUsage.user,
          system: cpuUsage.system,
        },
        dbStatus,
      });

      // Log critical issues
      if (dbStatus === 'unhealthy') {
        logError('System health check: Database is unhealthy');
      }

      if (memoryUsage.heapUsed / memoryUsage.heapTotal > 0.9) {
        logError('System health check: High memory usage', {
          heapUsed: memoryUsage.heapUsed,
          heapTotal: memoryUsage.heapTotal,
          percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
        });
      }
    } catch (error) {
      logError('System health check job failed', error);
      throw error;
    }
  }

  /**
   * Aggregate weekly analytics
   */
  private async aggregateWeeklyAnalytics() {
    logInfo('Aggregating weekly analytics');

    try {
      // Get all user profiles
      const profiles = await db.select().from(userProfiles);

      const analytics = {
        totalUsers: profiles.length,
        averageLevel: profiles.reduce((sum, p) => sum + p.level, 0) / profiles.length,
        averageXP: profiles.reduce((sum, p) => sum + p.xp, 0) / profiles.length,
        activeUsers: profiles.filter(p => {
          if (!p.lastPracticeDate) return false;
          const daysSinceLastPractice = Math.floor(
            (Date.now() - p.lastPracticeDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysSinceLastPractice <= 7;
        }).length,
        averageStreak: profiles.reduce((sum, p) => sum + p.streak, 0) / profiles.length,
      };

      logInfo('Weekly analytics aggregated', analytics);

      // In production, this would send to analytics service or dashboard
    } catch (error) {
      logError('Weekly analytics aggregation job failed', error);
      throw error;
    }
  }
}

// Export singleton instance
export const jobScheduler = JobScheduler.getInstance();
