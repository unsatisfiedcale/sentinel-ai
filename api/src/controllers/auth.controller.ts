import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Verileri alıyoruz (Zod doğrulamış varsayıyoruz)
    const { email, password, fullName } = req.body;

    // 2. E-posta kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Bu e-posta adresi zaten kullanımda.',
      });
    }

    // 3. Şifre Güvenliği (Hashleme)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Kullanıcıyı oluştur (Proje oluşturma kısmını sildik)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
      },
    });

    // 5. Başarı Yanıtı
    return res.status(201).json({
      success: true,
      message: 'Kayıt başarıyla tamamlandı. Artık giriş yapabilir ve ilk projenizi oluşturabilirsiniz.',
      data: {
        userId: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // 1. Kullanıcı var mı kontrol et
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'E-posta veya şifre hatalı.',
      });
    }

    // 2. Şifreyi doğrula
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'E-posta veya şifre hatalı.',
      });
    }

    // 3. JWT Token Oluştur
    // .env dosyana JWT_SECRET="cok-gizli-bir-key" eklemeyi unutma!
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' } // 7 gün geçerli olsun
    );

    // 4. Yanıtı Gönder
    return res.status(200).json({
      success: true,
      message: 'Giriş başarılı!',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
