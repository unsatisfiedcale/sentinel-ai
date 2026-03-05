import { Queue } from 'bullmq';
import { redisConfig } from '../config/redis.config';

// Kuyruğumuzu oluşturuyoruz
export const logQueue = new Queue('log-queue', {
  connection: redisConfig,
});

console.log('✅ BullMQ: Log kuyruğu aktif.');
