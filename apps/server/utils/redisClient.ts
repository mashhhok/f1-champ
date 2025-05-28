import { createClient } from 'redis';
import { REDIS_URL } from '../config/environment';

export const redisClient = createClient({
    url: REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));