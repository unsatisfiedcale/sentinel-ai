import prisma from '../lib/prisma.js';
import { LogData } from '../schemas/log.schemas.js';
export class LogService {
  static async processLog(data: LogData) {
    const { project, level, message, stack, meta } = data;

    try {
      // UPSERT: Aynı hatadan varsa count artır, yoksa yeni kayıt aç.
      const result = await prisma.log.upsert({
        where: {
          project_level_message: { project, level, message },
        },
        update: {
          count: { increment: 1 },
          updatedAt: new Date(),
        },
        create: {
          project,
          level,
          message,
          stack,
          meta,
          count: 1,
        },
      });

      return result;
    } catch (error) {
      console.error('❌ LogService Veritabanı Hatası:', error);
      throw error;
    }
  }
}
