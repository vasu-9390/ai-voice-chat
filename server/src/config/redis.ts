import Redis from 'ioredis';
import { config } from './env';
import { logger } from './logger';

class ResilientRedisService {
  private client: Redis | null = null;
  private memoryFallback: Map<string, { value: string; expiresAt?: number }> = new Map();
  public isConnected: boolean = false;

  constructor() {
    try {
      this.client = new Redis(config.REDIS_URL, {
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => {
          if (times > 3) {
            this.isConnected = false;
            return null; // Stop retrying and fall back to memory
          }
          return Math.min(times * 1000, 3000);
        },
        lazyConnect: true,
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        logger.info('Redis client connected successfully.');
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        logger.warn(`Redis connection unavailable (${err.message}). Using resilient in-memory cache.`);
      });

      this.client.connect().catch((err) => {
        this.isConnected = false;
        logger.warn(`Redis initial connect failed: ${err.message}. Operating in memory-fallback mode.`);
      });
    } catch (err: any) {
      this.isConnected = false;
      logger.warn(`Redis initialization error: ${err.message}. Operating in memory-fallback mode.`);
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.isConnected && this.client) {
      try {
        return await this.client.get(key);
      } catch {
        // fallback
      }
    }
    const item = this.memoryFallback.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.memoryFallback.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<'OK'> {
    if (this.isConnected && this.client) {
      try {
        if (mode === 'EX' && duration) {
          return await this.client.set(key, value, 'EX', duration);
        }
        return await this.client.set(key, value);
      } catch {
        // fallback
      }
    }
    const expiresAt = mode === 'EX' && duration ? Date.now() + duration * 1000 : undefined;
    this.memoryFallback.set(key, { value, expiresAt });
    return 'OK';
  }

  async del(...keys: string[]): Promise<number> {
    if (this.isConnected && this.client) {
      try {
        return await this.client.del(...keys);
      } catch {
        // fallback
      }
    }
    let count = 0;
    for (const k of keys) {
      if (this.memoryFallback.delete(k)) count++;
    }
    return count;
  }

  getNativeClient(): Redis | null {
    return this.client;
  }
}

export const redisClient = new ResilientRedisService();
