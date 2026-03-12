import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Geçersiz e-posta formatı'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
    fullName: z.string().min(2, 'İsim soyisim çok kısa').optional(), // name gitti, fullName geldi
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});
