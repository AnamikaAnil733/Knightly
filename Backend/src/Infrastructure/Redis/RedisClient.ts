import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const isTls = REDIS_URL.startsWith('rediss://');

export const redisClient = createClient({
  url: REDIS_URL,
  socket: {
    tls: isTls,
    rejectUnauthorized: false, // Often required for managed Redis providers
    reconnectStrategy: (retries) => {
      const delay = Math.min(retries * 100, 3000);
      return delay;
    },
  },
});

export const subClient = redisClient.duplicate();

// Logging & Error Handling
const setupClientLogging = (client: any, name: string) => {
  client.on('error', (err: any) => console.error(`[Redis] ${name} error:`, err));
  client.on('connect', () => console.log(`[Redis] ${name} connecting...`));
  client.on('ready', () => console.log(`[Redis] ${name} ready`));
  client.on('reconnecting', () => console.warn(`[Redis] ${name} reconnecting...`));
  client.on('end', () => console.warn(`[Redis] ${name} connection closed`));
};

setupClientLogging(redisClient, 'MainClient');
setupClientLogging(subClient, 'SubClient');

export const connectRedis = async () => {
  try {
    await Promise.all([redisClient.connect(), subClient.connect()]);
    
    // Verify connection
    const ping = await redisClient.ping();
    if (ping === 'PONG') {
      console.log("[Redis] Connection verified with PING");
    } else {
      throw new Error("Redis PING failed");
    }
  } catch (err) {
    console.error("[Redis] Initialization failed:", err);
    throw err;
  }
};
