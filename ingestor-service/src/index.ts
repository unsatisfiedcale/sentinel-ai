import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import logRoutes from './routes/log.routes';
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

// *** Testing the AI analysis infrastructure by capturing and reporting internal system errors. ***
// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config';
// import logRoutes from './routes/log.routes';
// import { errorHandler } from './middlewares/error.middleware';

// // 🛡️ SENTINEL SELF-OBSERVER
// const reportInternalError = async (err: any, type: string) => {
//   try {
//     const PORT = process.env.PORT;
//     const API_PATH = process.env.API_URL;

//     await fetch(`http://localhost:${PORT}${API_PATH}/logs`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         project: 'sentinel-ingestor-internal',
//         level: 'error',
//         message: `[${type}] ${err.message || 'Unknown Error'}`,
//         meta: {
//           stack: err.stack,
//           timestamp: new Date().toISOString(),
//         },
//       }),
//     });
//   } catch (reportErr) {
//     // Döngü oluşmaması için hata raporlama hatası sessiz geçilir
//   }
// };

// process.on('uncaughtException', (err) => {
//   reportInternalError(err, 'UNCAUGHT_EXCEPTION');
// });

// process.on('unhandledRejection', (reason) => {
//   const err = reason instanceof Error ? reason : new Error(String(reason));
//   reportInternalError(err, 'UNHANDLED_REJECTION');
// });

// const app = express();
// const PORT = process.env.PORT;
// const api = process.env.API_URL;

// app.use(express.json());
// app.use(cors());

// app.use(`${api}/logs`, logRoutes);

// app.use(errorHandler);

// // setTimeout(() => {
// //   throw new Error('⚠️ Vibe Check: Sistem ayaktayken fırlatılan bir hata!');
// // }, 3000);

// app.listen(PORT, () => {
//   console.log(`🚀 Server ${PORT} portunda hazır!`);
// });
