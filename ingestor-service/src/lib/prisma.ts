import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

// 1. PostgreSQL bağlantı havuzunu oluştur
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Prisma için PostgreSQL adaptörünü hazırla
const adapter = new PrismaPg(pool);

// 3. Prisma Client'ı bu adaptörle başlat (Prisma 7 kuralı)
const prisma = new PrismaClient({ adapter });

export default prisma;
