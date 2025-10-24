import { pgTable, serial, text, varchar, timestamp, boolean, integer, jsonb, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  stripeCustomerId: text('stripe_customer_id'),
  subscriptionStatus: varchar('subscription_status', { length: 50 }).default('free'),
  subscriptionTier: varchar('subscription_tier', { length: 50 }).default('free'),
  subscriptionEndDate: timestamp('subscription_end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at'),
});

// User profiles (gamification data)
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull().unique(),
  level: integer('level').default(1).notNull(),
  xp: integer('xp').default(0).notNull(),
  totalPoints: integer('total_points').default(0).notNull(),
  streak: integer('streak').default(0).notNull(),
  lastPracticeDate: timestamp('last_practice_date'),
  avatar: jsonb('avatar').$type<{
    skin: string;
    hair: string;
    outfit: string;
    accessory: string;
    unlocked: string[];
  }>().notNull(),
  vocalStats: jsonb('vocal_stats').$type<{
    pitchAccuracy: number;
    resonance: number;
    clarity: number;
    volumeControl: number;
    range: { lowest: number; highest: number };
  }>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Practice sessions
export const practiceSessions = pgTable('practice_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'song', 'exercise', 'challenge', 'mini-game'
  duration: integer('duration').notNull(), // in seconds
  score: integer('score').notNull(),
  stats: jsonb('stats').$type<{
    pitchAccuracy: number;
    resonance: number;
    clarity: number;
    volumeControl: number;
  }>().notNull(),
  improvements: jsonb('improvements').$type<string[]>().notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// AI-generated exercises
export const aiExercises = pgTable('ai_exercises', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'pitch', 'resonance', 'clarity', 'volume'
  difficulty: varchar('difficulty', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  instructions: jsonb('instructions').$type<string[]>().notNull(),
  targetMetrics: jsonb('target_metrics'),
  duration: integer('duration').notNull(),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Badges
export const badges = pgTable('badges', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  badgeType: varchar('badge_type', { length: 100 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  icon: varchar('icon', { length: 50 }).notNull(),
  rarity: varchar('rarity', { length: 50 }).notNull(),
  earnedAt: timestamp('earned_at').defaultNow().notNull(),
});

// Challenges
export const challenges = pgTable('challenges', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'daily', 'weekly', 'achievement'
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  difficulty: varchar('difficulty', { length: 50 }).notNull(),
  goal: integer('goal').notNull(),
  progress: integer('progress').default(0).notNull(),
  reward: jsonb('reward').$type<{
    type: string;
    value: number | string;
    name: string;
  }>().notNull(),
  expiresAt: timestamp('expires_at'),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// System health logs
export const healthLogs = pgTable('health_logs', {
  id: serial('id').primaryKey(),
  status: varchar('status', { length: 50 }).notNull(),
  uptime: integer('uptime').notNull(),
  memoryUsage: jsonb('memory_usage'),
  cpuUsage: jsonb('cpu_usage'),
  dbStatus: varchar('db_status', { length: 50 }).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Job execution logs
export const jobLogs = pgTable('job_logs', {
  id: serial('id').primaryKey(),
  jobName: varchar('job_name', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  duration: integer('duration'), // in milliseconds
  error: text('error'),
  metadata: jsonb('metadata'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles),
  sessions: many(practiceSessions),
  exercises: many(aiExercises),
  badges: many(badges),
  challenges: many(challenges),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));
