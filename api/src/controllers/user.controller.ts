import { Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
        // Kullanıcının projelerini ve anahtarlarını da getirelim mi?
        projects: {
          select: {
            id: true,
            name: true,
            apiKeys: {
              where: { isActive: true },
              select: { key: true, env: true },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
