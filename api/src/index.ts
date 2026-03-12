import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { errorHandler } from './middlewares/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import projectRoutes from './routes/project.routes.js';
// Route'ları yazdıkça buraya ekleyeceğiz
// import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT;
const api = process.env.API_URL;

// --- 1. PRE-MIDDLEWARES ---
app.use(express.json());
app.use(cors());

// --- 2. ROUTES ---
app.use(`${api}/auth`, authRoutes);
app.use(`${api}/users`, profileRoutes);
app.use(`${api}/projects`, projectRoutes);

// --- 3. GLOBAL ERROR HANDLER (En Sonda Olmalı!) ---
// Ingestor'da olduğu gibi dışarıdan aldığımız fonksiyonu buraya paslıyoruz
app.use(errorHandler);

// --- 4. START ---
app.listen(PORT, () => {
  console.log(`\n🚀 Sentinel API ${PORT} portunda hazır!`);
  console.log(`🔗 Temel URL: http://localhost:${PORT}${api}\n`);
});
