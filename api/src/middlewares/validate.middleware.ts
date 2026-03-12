import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validate = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Gelen isteği şemaya göre doğrula
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Her şey yolundaysa bir sonraki aşamaya (Controller) geç
      next();
    } catch (error) {
      // Eğer doğrulama hatası varsa (ZodError)
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed! Check your input.',
          // Hataları daha okunaklı bir formata çeviriyoruz
          errors: error.issues.map((err) => ({
            // err.path[1] genellikle 'email', 'password' gibi alan adını verir
            field: err.path[1] || err.path[0],
            message: err.message,
          })),
        });
      }

      // Beklenmedik bir hata olursa hata yakalayıcıya gönder
      next(error);
    }
  };
};
