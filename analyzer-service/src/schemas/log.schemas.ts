import { z } from 'zod';
import { Prisma, KeyEnv } from '@prisma/client';

const jsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() => {
  const nullableJson = z.union([jsonValueSchema, z.null()]);
  return z.union([z.string(), z.number(), z.boolean(), z.array(nullableJson), z.record(z.string(), nullableJson)]);
});

export const LogSchema = z.object({
  // 'project' (isim) gitti, 'projectId' ve 'env' geldi
  projectId: z.string().uuid('Invalid Project ID format'),
  env: z.nativeEnum(KeyEnv),
  level: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']), // Küçükleri BÜYÜK yap!
  message: z.string().min(1, 'Message is required'),
  stack: z.string().optional().nullable(),
  meta: jsonValueSchema.optional().default({}),
});

// Worker'ın kuyruktan çektiği veri tipi
export type LogData = z.infer<typeof LogSchema> & { timestamp?: Date };
