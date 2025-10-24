import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../config/env.js';
import * as schema from './schema.js';

const queryClient = postgres(env.DATABASE_URL);

export const db = drizzle(queryClient, { schema });

export async function testConnection() {
  try {
    await queryClient`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
