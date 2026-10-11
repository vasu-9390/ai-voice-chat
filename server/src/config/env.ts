import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  API_PREFIX: z.string().default('/api/v1'),
  CLIENT_URL: z.string().default('http://localhost:5173'),

  MONGODB_URI: z.string().default('mongodb://localhost:27017/cognivoice_saas'),
  REDIS_URL: z.string().default('redis://localhost:6379'),

  JWT_SECRET: z.string().default('super_secret_jwt_key_change_in_production_9f81a7b'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().default('super_secret_refresh_jwt_key_change_in_production_88b2'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  PASSWORD_SALT_ROUNDS: z.coerce.number().default(10),

  DEFAULT_AI_PROVIDER: z.enum(['openai', 'gemini', 'mock']).default('gemini'),
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4o'),
  GEMINI_MODEL: z.string().default('gemini-1.5-pro'),
  EMBEDDING_MODEL: z.string().default('text-embedding-3-small'),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_ID_PRO: z.string().default('price_growth_pro_monthly'),
  STRIPE_PRICE_ID_BUSINESS: z.string().default('price_scale_business_monthly'),

  SMTP_HOST: z.string().default('smtp.mailtrap.io'),
  SMTP_PORT: z.coerce.number().default(2525),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().default('"CogniVoice AI" <support@cognivoice.ai>'),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().default(200),
});

export const config = envSchema.parse(process.env);
