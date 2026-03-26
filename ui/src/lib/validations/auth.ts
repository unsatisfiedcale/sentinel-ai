import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Lütfen geçerli bir e-posta adresi girin."),
  password: z
    .string()
    .min(8, "Şifre en az 8 karakter olmalıdır."),
  fullName: z
    .string()
    .min(2, "İsim en az 2 karakter olmalıdır.")
    .optional()
    .or(z.literal("")),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Lütfen geçerli bir e-posta adresi girin."),
  password: z.string().min(1, "Şifre gerekli."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

