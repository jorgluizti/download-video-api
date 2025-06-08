// # O ponto de entrada da API, configura o Express e inicia o servidor// src/api/server.js

import express from 'express';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import apiRoutes from './routes.js';
import { scheduleCleanup } from '../workers/cleanupWorker.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Garante que o diretório de downloads exista
const DOWNLOAD_DIR = path.join(process.cwd(), 'downloads');
if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

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
  // Agenda a tarefa de limpeza quando o servidor sobe
  scheduleCleanup();
});