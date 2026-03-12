import prisma from '../lib/prisma.js';
import { LogData } from '../schemas/log.schemas.js';
import { PatternService } from './pattern.service.js';
import { Prisma } from '@prisma/client';

export class LogService {
  static async processLog(data: LogData) {
    // projectId ve env artık verinin içinde zorunlu
    const { projectId, env, level, message, stack, meta } = data;

    const normalizedMessage = PatternService.normalize(message);
    const metaForDb: Prisma.InputJsonValue = meta ?? {};

    try {
      const result = await prisma.log.upsert({
        where: {
          // Şemadaki @@unique([projectId, level, message, env]) kuralına tam uyum:
          projectId_level_message_env: {
            projectId,
            level,
            message: normalizedMessage,
            env,
          },
        },
        update: {
          count: { increment: 1 },
          updatedAt: new Date(),
        },
        create: {
          projectId,
          env,
          level,
          message: normalizedMessage,
          stack,
          meta: metaForDb,
          count: 1,
          aiAnalysis: 'AI_WAITING',
        },
      });

      return result;
    } catch (error) {
      console.error('❌ LogService Veritabanı Hatası:', error);
      throw error;
    }
  }
}
