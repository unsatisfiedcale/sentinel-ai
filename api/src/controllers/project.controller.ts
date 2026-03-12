import { Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export const createProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const userId = req.user?.userId;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, message: 'Geçerli bir proje adı gereklidir.' });
    }

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Yetkisiz erişim.' });
    }

    const project = await prisma.$transaction(async (tx) => {
      return await tx.project.create({
        data: {
          name,
          userId: userId,
          apiKeys: {
            create: [
              {
                env: 'DEVELOPMENT',
                isActive: true,
              },
            ],
          },
        },
        include: {
          apiKeys: true,
        },
      });
    });

    return res.status(201).json({
      success: true,
      message: 'Proje ve geliştirme anahtarı başarıyla oluşturuldu.',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Yetkisiz erişim.' });
    }

    // Query parametresinden silinenleri isteyip istemediğini alabiliriz
    // Örn: /api/projects?showDeleted=true
    const showDeleted = req.query.showDeleted === 'true';

    const projects = await prisma.project.findMany({
      where: {
        userId: userId,
        // Eğer showDeleted true ise filtreyi kaldır, değilse sadece isDeleted: false olanları getir
        isDeleted: showDeleted ? undefined : false,
      },
      include: {
        apiKeys: {
          where: { isDeleted: false }, // Silinmiş anahtarları listeleme kirlilik yapmasın
          select: {
            key: true,
            env: true,
            isActive: true,
          },
        },
        _count: {
          select: {
            logs: true, // Toplam log sayısını hala görebiliriz
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, message: 'Geçersiz proje ID.' });
    }

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Yetkisiz erişim.' });
    }

    // Projeyi bulurken isDeleted: false olmasına bakıyoruz (zaten silinmiş bir şeyi tekrar silemesin)
    const project = await prisma.project.findFirst({
      where: {
        id,
        userId,
        isDeleted: false,
      },
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Proje bulunamadı veya zaten silinmiş.' });
    }

    // SOFT DELETE OPERASYONU
    // Transaction kullanarak hem projeyi hem keyleri aynı anda işaretliyoruz
    await prisma.project.update({
      where: { id },
      data: {
        isDeleted: true,
        // Projeye bağlı tüm API Key'leri de pasif yapıyoruz
        apiKeys: {
          updateMany: {
            where: { projectId: id },
            data: {
              isActive: false,
              isDeleted: true,
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Proje ve ilgili tüm anahtarlar başarıyla arşive kaldırıldı.',
    });
  } catch (error) {
    next(error);
  }
};
