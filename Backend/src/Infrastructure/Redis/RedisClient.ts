import { createClient } from 'redis';

export const redisClient = createClient({ url: process.env.REDIS_URL });
export const subClient = redisClient.duplicate();

redisClient.on('error', (err) => console.error('[Redis] Client error:', err));
subClient.on('error',   (err) => console.error('[Redis] Sub-client error:', err));

export const connectRedis = async () => {
  await Promise.all([redisClient.connect(), subClient.connect()]);
  console.log("Redis connected successfully");
};
