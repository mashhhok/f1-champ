import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('4000').transform(Number),
  DB_HOST: z.string().url(),
  REDIS_URL: z.string().optional(),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000').transform(val => val.split(',')),
  API_BASE_URL: z.string().default('https://api.jolpi.ca/ergast/f1/'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  RATE_LIMIT_WINDOW: z.string().default('900000').transform(Number), // 15 minutes
  RATE_LIMIT_MAX: z.string().default('100').transform(Number),
  CACHE_TTL: z.string().default('3600').transform(Number), // 1 hour
  START_YEAR: z.string().default('2005').transform(Number),
});

export type Environment = z.infer<typeof envSchema>;

const parseEnv = (): Environment => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    // Use console.error here since logger depends on environment being loaded
    console.error('Invalid environment variables:', error);
    process.exit(1);
  }
};

export const environment = parseEnv();