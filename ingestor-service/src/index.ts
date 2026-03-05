import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import logRoutes from './routes/log.route';
import { errorHandler } from './middlewares/error.middleware';

const app = express();
const PORT = process.env.PORT || 3001; // Port gelmezse fallback olarak 3001
const api = process.env.API_URL || '/api/v1';

// 1. Pre-Middlewares (Önce çalışanlar)
app.use(express.json());
app.use(cors());

// 2. Routes (Rotalar)
app.use(`${api}/logs`, logRoutes);

// 3. Error Handler (Her zaman en sonda olmalı!)
// Express, 4 parametreli (err, req, res, next) fonksiyonu gördüğü an 
// "Tamam bu bir hata yakalayıcıdır" der ve hataları buraya paslar.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda hazır!`);
  console.log(`🔗 API Yolu: ${api}/logs`);
});