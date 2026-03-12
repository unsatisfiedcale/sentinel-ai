import { RedisOptions } from 'ioredis';

export const redisConfig: RedisOptions = {
  host: String(process.env.REDIS_HOST),
  port: Number(process.env.REDIS_PORT),

  // Live'da sunucu şifre beklediği için yanlış anahtarla girmeye çalışınca hata verecektir.
  // 1. Redis sunucusunda 'requirepass' ile şifre koyulmalı.
  password: process.env.REDIS_PASSWORD,

  maxRetriesPerRequest: null,
};
