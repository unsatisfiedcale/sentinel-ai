import prisma from '../lib/prisma';
import { LogInput } from '../schemas/log.schemas';

export const createLog = async (logData: LogInput) => {
  // Burada ileride log filtreleme veya bildirim (Slack/Mail) mantığı eklenebilir.
  return await prisma.log.create({
    data: logData,
  });
};

// DB'den logları checklemek için yazdık. Şu an kullanılmıyor hiçbir yerde.
export const getLogs = async (limit: number = 50) => {
  return await prisma.log.findMany({
    take: limit,
    orderBy: { timestamp: 'desc' },
  });
};