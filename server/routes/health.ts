/**
 * HEALTH MONITORING ROUTES
 *
 * Endpoints for system health monitoring and status checks
 */

import { Router, Request, Response } from 'express';
import { db } from '../db/index.js';
import { users, healthLogs } from '../db/schema.js';
import { desc } from 'drizzle-orm';
import { logError } from '../config/logger.js';

const router = Router();

/**
 * Basic health check
 * GET /api/health
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
      },
    });
  } catch (error) {
    logError('Health check failed', error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Health check failed',
    });
  }
});

/**
 * Detailed health check
 * GET /api/health/detailed
 */
router.get('/detailed', async (_req: Request, res: Response) => {
  try {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    // Test database connection
    let dbStatus = 'healthy';
    let dbLatency = 0;
    try {
      const startTime = Date.now();
      await db.select().from(users).limit(1);
      dbLatency = Date.now() - startTime;
    } catch (error) {
      dbStatus = 'unhealthy';
      logError('Database connection check failed', error);
    }

    // Get recent health logs
    const recentLogs = await db
      .select()
      .from(healthLogs)
      .orderBy(desc(healthLogs.timestamp))
      .limit(10);

    res.json({
      status: dbStatus === 'healthy' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
        heapUsedPercentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
      database: {
        status: dbStatus,
        latency: dbLatency + ' ms',
      },
      recentHealthLogs: recentLogs.slice(0, 5),
    });
  } catch (error) {
    logError('Detailed health check failed', error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Detailed health check failed',
    });
  }
});

/**
 * Database health check
 * GET /api/health/db
 */
router.get('/db', async (_req: Request, res: Response) => {
  try {
    const startTime = Date.now();

    // Test read operation
    await db.select().from(users).limit(1);
    const readLatency = Date.now() - startTime;

    // Get database statistics
    const userCount = await db.select().from(users);

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      latency: readLatency + ' ms',
      statistics: {
        totalUsers: userCount.length,
      },
    });
  } catch (error) {
    logError('Database health check failed', error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Database connection failed',
    });
  }
});

/**
 * Readiness probe (for Kubernetes/Railway)
 * GET /api/health/ready
 */
router.get('/ready', async (_req: Request, res: Response) => {
  try {
    // Check if database is ready
    await db.select().from(users).limit(1);

    res.json({
      status: 'ready',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logError('Readiness check failed', error);
    res.status(503).json({
      status: 'not ready',
      error: 'Service is not ready',
    });
  }
});

/**
 * Liveness probe (for Kubernetes/Railway)
 * GET /api/health/live
 */
router.get('/live', (_req: Request, res: Response) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
});

export default router;
