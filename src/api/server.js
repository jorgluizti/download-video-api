// // src/api/server.js
// import express from 'express';
// import rateLimit from 'express-rate-limit';
// import 'dotenv/config';
// import apiRoutes from './routes.js';

// // REMOVIDO: A importação do scheduleCleanup não é necessária nesta arquitetura.
// // import { scheduleCleanup } from '../workers/cleanupWorker.js'; 

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middlewares
// app.set('trust proxy', 1);
// app.use(express.json());

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutos
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: 'Muitas requisições enviadas deste IP, por favor tente novamente após 15 minutos.'
// });
// app.use(limiter);

// // Usar as rotas definidas no arquivo separado
// app.use('/', apiRoutes);

// // Iniciar o servidor
// app.listen(PORT, () => {
//   console.log(`🚀 API rodando na porta ${PORT}`);
//   // REMOVIDO: A chamada para scheduleCleanup() não é mais necessária.
// });

// src/api/server.js
import express from 'express';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import apiRoutes from './routes.js';
// A importação do scheduleCleanup não é mais necessária, como já removemos.

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.set('trust proxy', 1);

// ==========================================================
//              INÍCIO DA ALTERAÇÃO
// ==========================================================

// Aumentamos o limite do corpo do JSON para 500kb para acomodar os cookies
app.use(express.json({ limit: '500kb' }));

// ==========================================================
//                FIM DA ALTERAÇÃO
// ==========================================================


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Muitas requisições enviadas deste IP, por favor tente novamente após 15 minutos.'
});
app.use(limiter);

app.use('/', apiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
  // A chamada para scheduleCleanup() já foi removida, o que está correto.
});