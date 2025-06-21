// src/api/routes.js
import { Router } from 'express';
import { Queue } from 'bullmq';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { bullmqConnectionConfig } from '../config/redis.js';

const router = Router();
const downloadQueue = new Queue('downloadQueue', { connection: bullmqConnectionConfig });

// --- Configuração do Cliente S3 (igual ao worker) ---
const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://<SEU_ACCOUNT_ID>.r2.cloudflarestorage.com`, // ⚠️ SUBSTITUA PELO SEU ACCOUNT ID
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const BUCKET_NAME = process.env.R2_BUCKET_NAME;


// --- ROTAS DA API ---

// Rota 1: Cliente envia a URL do Insta + Cookies para iniciar o processo
router.post('/download', async (req, res) => {
  const { instagramUrl, userCookies } = req.body;
  if (!instagramUrl || !userCookies) {
    return res.status(400).json({ message: 'URL do Instagram e cookies são obrigatórios.' });
  }

  const jobId = uuidv4();
  await downloadQueue.add('download-video', { instagramUrl, userCookies }, { jobId, attempts: 2 });

  res.status(202).json({ message: 'Solicitação recebida.', requestId: jobId });
});

// Rota 2: Cliente pergunta o status do job
router.get('/status/:id', async (req, res) => {
  const job = await downloadQueue.getJob(req.params.id);
  if (!job) return res.status(404).json({ status: 'not_found' });

  const status = await job.getState();
  if (status === 'completed') {
    res.json({ status, result: job.returnvalue });
  } else if (status === 'failed') {
    res.json({ status, reason: job.failedReason });
  } else {
    res.json({ status });
  }
});

// Rota 3: Cliente, após job completo, pede o link de download do R2
router.get('/download/:key', async (req, res) => {
  const { key } = req.params;

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    // Gera uma URL assinada que expira em 5 minutos
    const signedUrl = await getSignedUrl(R2, command, { expiresIn: 300 });

    // Redireciona o cliente para a URL assinada do R2
    res.redirect(302, signedUrl);
  } catch (error) {
    console.error("Erro ao gerar URL assinada:", error);
    res.status(500).send("Não foi possível obter o link de download.");
  }
});

export default router;