import 'dotenv/config';
import { Worker, Job, type ConnectionOptions } from 'bullmq';
import { redisConfig } from './config/redis.config.js';
import { LogService } from './services/log.service.js';
import { AIService } from './services/ai.service.js'; // 1. AI Servisini ekledik
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
      // 1. Veriyi doğrula
      const validatedData = LogSchema.parse(job.data);

      // 2. Logu işle ve DB'ye kaydet (LogService sana mevcut logu döndürüyor)
      const result = await LogService.processLog(validatedData);

      console.log(`✅ [${result.project}] Log İşlendi. ID: ${result.id} | Count: ${result.count}`);

      // 🚀 3. AKILLI AI KONTROLÜ (Deduplication)
      // Eğer bu log daha önce analiz edildiyse (aiAnalysis sütunu boş değilse) AI'ya gitme!
      if (result.aiAnalysis) {
        console.log(`⏭️ [WORKER] Log #${result.id} zaten analiz edilmiş. AI adımı atlanıyor.`);
        return;
      }

      // 4. AI ANALİZ ADIMI (Sadece ilk kez geliyorsa buraya düşer)
      try {
        console.log(`🤖 AI Analizi başlıyor: ${result.id}...`);

        const analysis = await AIService.analyzeLog(
          validatedData.message,
          validatedData.stack ?? undefined,
          validatedData.meta
        );

        await prisma.log.update({
          where: { id: result.id },
          data: { aiAnalysis: analysis },
        });

        console.log(`✨ AI Analizi tamamlandı ve kaydedildi: ${result.id}`);
      } catch (aiErr) {
        console.error(`⚠️ AI Analizi sırasında hata (DB'ye yazılamadı):`, aiErr);
      }
    } catch (error: any) {
      console.error(`❌ Job ${job.id} Hatası:`, error.message);
      throw error;
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

worker.on('ready', () => {
  console.log(`🤖 Analyzer Worker pusuda... "${QUEUE_NAME}" kuyruğu dinleniyor.`);
});

worker.on('failed', (job, err) => {
  console.error(`🚨 Job ${job?.id} tamamen başarısız oldu: ${err.message}`);
});

export default worker;
