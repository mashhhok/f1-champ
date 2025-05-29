import { createClient, RedisClientType } from 'redis';
import { environment } from '../config/environment';
import { logger } from './logger';

class RedisService {
  private client: RedisClientType | null = null;
  private isConnected: boolean = false;

  async connect(): Promise<void> {
    if (this.client && this.isConnected) {
      return;
    }

    try {
      this.client = createClient({
        url: environment.REDIS_URL || 'redis://localhost:6379',
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              logger.error('Max Redis reconnection attempts reached');
              return new Error('Max reconnection attempts reached');
            }
            return Math.min(retries * 50, 500);
          }
        }
      });

      this.client.on('error', (err) => {
        logger.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logger.info('Redis Client Connected');
        this.isConnected = true;
      });

      await this.client.connect();
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      this.isConnected = false;
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected || !this.client) {
      return null;
    }

    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error(`Redis get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    if (!this.isConnected || !this.client) {
      return;
    }

    try {
      await this.client.set(key, value);
    } catch (error) {
      logger.error(`Redis set error for key ${key}:`, error);
    }
  }

  async setEx(key: string, seconds: number, value: string): Promise<void> {
    if (!this.isConnected || !this.client) {
      return;
    }

    try {
      await this.client.setEx(key, seconds, value);
    } catch (error) {
      logger.error(`Redis setEx error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected || !this.client) {
      return;
    }

    try {
      await this.client.del(key);
    } catch (error) {
      logger.error(`Redis del error for key ${key}:`, error);
    }
  }

  getClient(): RedisClientType | null {
    return this.client;
  }

  isHealthy(): boolean {
    return this.isConnected;
  }
}

// Create singleton instance
const redisService = new RedisService();

// Initialize connection
redisService.connect().catch(error => {
  logger.error('Initial Redis connection failed:', error);
});

// Export for backward compatibility
export const redisClient = {
  get: (key: string) => redisService.get(key),
  set: (key: string, value: string) => redisService.set(key, value),
  setEx: (key: string, seconds: number, value: string) => redisService.setEx(key, seconds, value),
  del: (key: string) => redisService.del(key),
  on: (_event: string, _handler: Function) => {
    // For backward compatibility - do nothing
  }
};

export { redisService };