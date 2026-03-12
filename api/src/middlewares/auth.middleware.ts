import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// 1. Beklediğimiz Token yapısını tanımlıyoruz
interface UserPayload extends JwtPayload {
  userId: string;
  email: string;
}

// 2. Request tipini genişletiyoruz
export interface AuthRequest extends Request {
  user?: UserPayload;
}

// 3. MAGIC: Type Guard Fonksiyonu
function isUserPayload(decoded: string | JwtPayload): decoded is UserPayload {
  return typeof decoded !== 'string' && 'userId' in decoded && 'email' in decoded;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token bulunamadı.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ success: false, message: 'Server yapılandırma hatası.' });
    }

    const decoded = jwt.verify(token, secret);

    // 4. Doğrulama: Eğer verinin tipi UserPayload ise içeri al
    if (isUserPayload(decoded)) {
      req.user = decoded;
      return next();
    }

    return res.status(403).json({ success: false, message: 'Geçersiz token yapısı.' });
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Geçersiz veya süresi dolmuş token.' });
  }
};
