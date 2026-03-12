import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(' [ERROR LOG]:', err);

  // Prisma veya diğer kütüphanelerden gelen özel hataları burada yakalayabiliriz
  const statusCode = err.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Geliştirme aşamasında hatanın detayını (stack) görmek işimize yarar
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
