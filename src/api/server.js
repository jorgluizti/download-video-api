// # O ponto de entrada da API, configura o Express e inicia o servidor// src/api/server.js

// import express from 'express';
// import rateLimit from 'express-rate-limit';
// import path from 'path';
// import fs from 'fs';
// import apiRoutes from './routes.js';
// import { scheduleCleanup } from '../workers/cleanupWorker.js';

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Garante que o diretório de downloads exista
// const DOWNLOAD_DIR = path.resolve('/data/downloads');
// if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

// // Middlewares
// app.set('trust proxy', 1);
// app.use(express.json());

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
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
//   // Agenda a tarefa de limpeza quando o servidor sobe
//   scheduleCleanup();
// });

// 1.0

// src/api/server.js
import express from 'express';
import rateLimit from 'express-rate-limit';
import 'dotenv/config'; // Garante que as variáveis de ambiente sejam carregadas
import apiRoutes from './routes.js';
import { scheduleCleanup } from '../workers/cleanupWorker.js';

const app = express();
// A porta agora é lida da variável de ambiente, com 3000 como padrão
const PORT = process.env.PORT || 3000;

// --- Bloco Removido ---
// A lógica de DOWNLOAD_DIR e fs.mkdirSync não é mais necessária aqui.
// O worker agora usa um diretório temporário, e a API não acessa mais o disco.

// Middlewares
app.set('trust proxy', 1);
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Muitas requisições enviadas deste IP, por favor tente novamente após 15 minutos.'
});
app.use(limiter);

// Usar as rotas definidas no arquivo separado
app.use('/', apiRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
  // Agenda a tarefa de limpeza para o R2 quando o servidor sobe
  scheduleCleanup();
});