import { Worker, Job, type ConnectionOptions } from 'bullmq';
import { redisConfig } from './config/redis.config.js';
import { LogService } from './services/log.service.js';
import { AIService } from './services/ai.service.js';
import { LogSchema, type LogData } from './schemas/log.schemas.js';
import prisma from './lib/prisma.js';

const QUEUE_NAME = 'log-queue';

const connection: ConnectionOptions = {
  host: redisConfig.host,
  port: redisConfig.port,
  password: redisConfig.password,
  maxRetriesPerRequest: redisConfig.maxRetriesPerRequest,
};

const worker = new Worker(
  QUEUE_NAME,
  async (job: Job<LogData>) => {
    try {
      // 1. Gelen veriyi doğrula
      const validatedData = LogSchema.parse(job.data);

      // 2. Veritabanına kaydet (Upsert mantığı LogService içinde çalışır)
      const result = await LogService.processLog(validatedData);

      // Log çıktısını projectId ve env ile güncelledik
      console.log(`✅ [${result.env}] Log İşlendi. ProjeID: ${result.projectId} | Count: ${result.count}`);

      // 🛡️ ATOMİK KİLİTLEME ADIMI
      const lock = await prisma.log.updateMany({
        where: {
          id: result.id,
          aiAnalysis: 'AI_WAITING',
        },
        data: {
          aiAnalysis: 'PROCESSING',
        },
      });

      if (lock.count === 0) {
        console.log(`⏭️ [WORKER] Analiz zaten yürütülüyor veya tamamlanmış: ${result.id}`);
        return;
      }

      // 🤖 AI ANALİZ ADIMI
      try {
        console.log(`🤖 AI Analizi başlatılıyor: ${result.id} (${result.env})...`);

        const analysis = await AIService.analyzeLog(
          result.message, // Normalize edilmiş mesaj
          validatedData.stack ?? undefined,
          validatedData.meta,
          result.env // DÜZELTME: Artık AI'ya hangi ortamda olduğumuzu söylüyoruz!
        );

        await prisma.log.update({
          where: { id: result.id },
          data: {
            aiAnalysis: analysis,
            isAnalyzed: true, // Analiz bitti bayrağını dikiyoruz
          },
        });

        console.log(`✨ AI Analizi tamamlandı: ${result.id}`);
      } catch (aiErr) {
        // Hata olursa durumu başarısızlığa çek
        await prisma.log.update({
          where: { id: result.id },
          data: { aiAnalysis: 'Analysis_Failed' },
        });
        console.error(`⚠️ AI Hatası:`, aiErr);
      }
    } catch (error: unknown) {
      console.error(`❌ Job ${job.id} Hatası:`, error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 5, // Aynı anda 5 logu AI'ya gönderebilir (Sistemi yormamak için ideal)
  }
);

worker.on('ready', () => {
  console.log(`🤖 Analyzer Worker pusuda... "${QUEUE_NAME}" kuyruğu dinleniyor.`);
});

worker.on('failed', (job, err) => {
  console.error(`🚨 Job ${job?.id} tamamen başarısız oldu: ${err.message}`);
});

export default worker;
