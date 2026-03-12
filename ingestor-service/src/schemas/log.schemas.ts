import { z } from 'zod';
import type { Prisma, KeyEnv } from '@prisma/client'; // Prisma'yı geri çağırdık!

// 1. JSON Değerleri için Prisma uyumlu Zod Şeması (Meta alanı için şart)
const jsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() => {
  const nullableJson = z.union([jsonValueSchema, z.null()]);
  return z.union([z.string(), z.number(), z.boolean(), z.array(nullableJson), z.record(z.string(), nullableJson)]);
});

// 2. Dışarıdan (SDK/Postman) gelen ham veri şeması
export const logSchema = z.object({
  level: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']), // Küçükleri BÜYÜK yap!
  message: z.string().min(1, 'Message is required'),
  stack: z.string().optional().nullable(),
  meta: jsonValueSchema.optional().default({}), // Prisma uyumlu JSON şemasını buraya bağladık
});

// 3. Kuyruğa giren ve Worker'ın işleyeceği TAM veri tipi
// Yeni şemadaki 'env' (KeyEnv) bilgisini de buraya ekliyoruz
export type LogData = z.infer<typeof logSchema> & {
  projectId: string;
  env: KeyEnv; // DEVELOPMENT, PRODUCTION, STAGING
  timestamp: Date;
};

// 4. Sadece Input (Body) tipi
export type LogInput = z.infer<typeof logSchema>;
