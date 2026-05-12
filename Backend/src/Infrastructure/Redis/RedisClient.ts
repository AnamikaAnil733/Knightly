import { createClient } from 'redis';

export const redisClient = createClient({ url: process.env.REDIS_URL });
export const subClient = redisClient.duplicate();

export const connectRedis = async () => {
  await Promise.all([redisClient.connect(), subClient.connect()]);
  console.log("Redis connected successfully");
};
