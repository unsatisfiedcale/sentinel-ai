import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { KeyEnv } from '@prisma/client';

export interface LogRequest extends Request {
  projectId?: string;
  env?: KeyEnv;
}

export const validateApiKey = async (req: LogRequest, res: Response, next: NextFunction) => {
  const apiKeyHeader = req.headers['x-api-key'];
  const apiKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader;

  if (!apiKey || typeof apiKey !== 'string') {
    return res.status(401).json({
      success: false,
      message: 'API Key eksik veya geçersiz formatta.',
    });
  }

  try {
    // KRİTİK DEĞİŞİKLİK: Key'in kendisinin silinmemiş olması (isDeleted: false)
    // VE bağlı olduğu projenin silinmemiş olması (project: { isDeleted: false }) şart!
    const keyData = await prisma.apiKey.findUnique({
      where: {
        key: apiKey,
        isActive: true,
        isDeleted: false, // Silinmiş keyleri reddet
      },
      include: {
        project: {
          select: { isDeleted: true }, // Projenin silinme durumunu da çekiyoruz
        },
      },
    });

    // Key yoksa VEYA bağlı olduğu proje silinmişse (Soft Delete yapılmışsa) geçit verme!
    if (!keyData || keyData.project.isDeleted) {
      return res.status(403).json({
        success: false,
        message: 'Geçersiz, pasif veya silinmiş bir projeye ait API Key.',
      });
    }

    req.projectId = keyData.projectId;
    req.env = keyData.env;

    next();
  } catch (error) {
    next(error);
  }
};
