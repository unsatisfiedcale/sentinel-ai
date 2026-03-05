import { Request, Response, NextFunction } from 'express';
import { logQueue } from '../queues/log.queue';

export const ingestorLog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logData = req.body;

    // ESKİ: const savedLog = await LogService.createLog(req.body);
    // YENİ: Veriyi direkt Redis'e (Kuyruğa) atıyoruz
    await logQueue.add('process-log', logData, {
      attempts: 3, // Eğer bir hata olursa 3 kere tekrar dene
      backoff: {
        type: 'exponential',
        delay: 1000, // Hata alırsa 1sn, sonra 2sn, sonra 4sn bekleyip dener
      },
      removeOnComplete: true, // İşlem başarıyla bitince Redisten temizle (Yer kaplamasın)
    });

    // Eskiden 201 (Created) dönüyorduk, şimdi 202 (Accepted) dönüyoruz.
    // Çünkü "Aldık, sıraya koyduk ama henüz DB'ye yazmadık" demek daha doğru.
    res.status(202).json({
      success: true,
      message: 'Log kuyruğa alındı, arka planda işlenecek.',
    });
  } catch (error) {
    next(error);
  }
};
