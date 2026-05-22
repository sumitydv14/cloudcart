import dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config();

const redisHost = process.env.REDIS_HOST ?? 'redis';
const redisPort = process.env.REDIS_PORT ?? '6379';
const redisUrl = process.env.REDIS_URL ?? `redis://${redisHost}:${redisPort}`;

export const redisClient = new Redis(redisUrl);
