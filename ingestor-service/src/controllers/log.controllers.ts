import { Response, NextFunction } from 'express';
import { logQueue } from '../queues/log.queue.js';
import { LogRequest } from '../middlewares/apiKey.middleware.js';

export const ingestorLog = async (req: LogRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, env } = req;
    const logBody = req.body;

    // TypeScript artık projectId ve env'nin tipini biliyor
    await logQueue.add(
      'process-log',
      {
        ...logBody,
        projectId,
        env,
        timestamp: new Date(),
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
      }
    );

    res.status(202).json({ success: true, message: 'Log kuyruğa alındı.' });
  } catch (error) {
    next(error);
  }
};
