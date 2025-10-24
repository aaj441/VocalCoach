import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),

  DATABASE_URL: z.string(),

  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('7d'),
  SESSION_SECRET: z.string(),

  STRIPE_SECRET_KEY: z.string(),
  STRIPE_PUBLISHABLE_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  STRIPE_PRICE_ID_BASIC: z.string().optional(),
  STRIPE_PRICE_ID_PRO: z.string().optional(),

  OPENAI_API_KEY: z.string(),

  HEALTH_CHECK_INTERVAL: z.string().default('60000'),
  BACKUP_INTERVAL: z.string().default('86400000'),

  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;

export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
