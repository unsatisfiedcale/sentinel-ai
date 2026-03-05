import { z } from 'zod';
import type { Prisma } from '@prisma/client';

const jsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() => {
  const nullableJson = z.union([jsonValueSchema, z.null()]);
  return z.union([z.string(), z.number(), z.boolean(), z.array(nullableJson), z.record(z.string(), nullableJson)]);
});

export const logSchema = z.object({
  project: z.string().min(1, 'Project name is required'),
  level: z.enum(['info', 'warn', 'error']),
  message: z.string().min(1, 'Message is required'),
  stack: z.string().optional().nullable(),
  meta: jsonValueSchema.optional().default({}),
});

export type LogInput = z.infer<typeof logSchema>;
