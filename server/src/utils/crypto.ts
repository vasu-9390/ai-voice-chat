import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { config } from '../config/env';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, config.PASSWORD_SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateApiKey = (): { key: string; prefix: string; hash: string } => {
  const rawKey = `cg_${crypto.randomBytes(24).toString('hex')}`;
  const prefix = rawKey.substring(0, 10);
  const hash = crypto.createHash('sha256').update(rawKey).digest('hex');
  return { key: rawKey, prefix, hash };
};

export const hashApiKey = (rawKey: string): string => {
  return crypto.createHash('sha256').update(rawKey).digest('hex');
};

export const generateRandomToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};
