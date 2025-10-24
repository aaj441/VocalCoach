/**
 * VOCALCOACH SERVER
 *
 * Main server file with:
 * - Express app setup
 * - Middleware configuration
 * - Route registration
 * - Error handling
 * - Job scheduler initialization
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { logInfo, logError } from './config/logger.js';
import { testConnection } from './db/index.js';
import { jobScheduler } from './jobs/scheduler.js';

// Import routes
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.routes.js';
import vocalRoutes from './routes/vocal.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ==================== MIDDLEWARE ====================

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// Compression
app.use(compression());

// Body parsing
// IMPORTANT: Stripe webhook needs raw body, so we handle it specially
app.use('/api/subscription/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logInfo('Request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
});

// ==================== ROUTES ====================

// Health check (no /api prefix for simplicity)
app.use('/health', healthRoutes);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/vocal', vocalRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Serve static files from the frontend build
// The frontend build is in the root /dist folder, server build is in /dist/server
const frontendDistPath = path.join(__dirname, '../../dist');
app.use(express.static(frontendDistPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req: Request, res: Response) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return res.status(404).json({
      error: 'Not found',
      path: req.path,
    });
  }

  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Global error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logError('Unhandled error', err, {
    method: req.method,
    path: req.path,
  });

  res.status(500).json({
    error: env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// ==================== SERVER STARTUP ====================

async function startServer() {
  try {
    // Test database connection
    logInfo('Testing database connection...');
    const dbConnected = await testConnection();

    if (!dbConnected) {
      throw new Error('Database connection failed');
    }

    logInfo('Database connection successful');

    // Start job scheduler
    if (env.NODE_ENV === 'production') {
      logInfo('Starting job scheduler...');
      jobScheduler.start();
      logInfo('Job scheduler started');
    } else {
      logInfo('Job scheduler disabled in development mode');
    }

    // Start HTTP server
    const port = env.PORT;
    app.listen(port, () => {
      logInfo('🚀 VocalCoach server started', {
        port,
        env: env.NODE_ENV,
        nodeVersion: process.version,
      });
      console.log(`\n🎤 VocalCoach API running on http://localhost:${port}`);
      console.log(`📊 Health check: http://localhost:${port}/health`);
      console.log(`🔧 Environment: ${env.NODE_ENV}\n`);
    });
  } catch (error) {
    logError('Failed to start server', error);
    process.exit(1);
  }
}

// ==================== GRACEFUL SHUTDOWN ====================

process.on('SIGTERM', () => {
  logInfo('SIGTERM received, shutting down gracefully...');

  // Stop job scheduler
  jobScheduler.stop();

  // Close server
  process.exit(0);
});

process.on('SIGINT', () => {
  logInfo('SIGINT received, shutting down gracefully...');

  // Stop job scheduler
  jobScheduler.stop();

  // Close server
  process.exit(0);
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logError('Unhandled Rejection', reason as Error, { promise });
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logError('Uncaught Exception', error);
  process.exit(1);
});

// ==================== START ====================

startServer();

export default app;
