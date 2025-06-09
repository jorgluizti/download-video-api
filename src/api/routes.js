// // # Define todas as rotas da API// src/api/routes.js

// import { Router } from 'express';
// import { v4 as uuidv4 } from 'uuid';
// import path from 'path';
// import fs from 'fs';
// import { downloadQueue } from '../config/queues.js';

// const router = Router();
// // const DOWNLOAD_DIR = path.join(process.cwd(), '/data/downloads');
// const DOWNLOAD_DIR = path.resolve('/data/downloads');

// router.post('/download', async (req, res) => {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: 'Link obrigatório' });

//   // ✅ --- LOG DE DEPURAÇÃO 3 ---
//   console.log(`[API] Recebida requisição para a URL: ${url}`);

//   const jobId = uuidv4();
//   await downloadQueue.add(
//     'download-video',
//     { url, requestId: jobId },
//     { jobId, timeout: 180000 }
//   );

//   // ✅ --- LOG DE DEPURAÇÃO 4 ---
//   console.log(`[API] Job ${jobId} adicionado à fila com sucesso.`);

//   res.status(202).json({ requestId: jobId, status: 'queued' });
// });

// router.get('/status/:id', async (req, res) => {
//   const jobId = req.params.id;
//   const job = await downloadQueue.getJob(jobId);

//   if (!job) {
//     return res.status(404).json({ status: 'not_found' });
//   }

//   const state = await job.getState();
//   switch (state) {
//     case 'completed':
//       res.json({ status: 'completed' });
//       break;
//     case 'failed':
//       res.json({ status: 'failed', reason: job.failedReason });
//       break;
//     default:
//       res.json({ status: 'processing' });
//       break;
//   }
// });

// router.get('/download/:id', (req, res) => {
//   const jobId = req.params.id;
//   const filePath = path.join(DOWNLOAD_DIR, `${jobId}.mp4`);

//   if (fs.existsSync(filePath)) {
//     res.download(filePath, (err) => {
//       if (err) console.error(`Erro ao enviar o arquivo ${jobId}.mp4:`, err);
//     });
//   } else {
//     res.status(404).json({ error: 'Arquivo não encontrado ou expirado.' });
//   }
// });

// export default router;

// src/api/routes.js
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { downloadQueue } from '../config/queues.js';

const router = Router();
const DOWNLOAD_DIR = path.resolve('/data/downloads');

router.post('/download', async (req, res) => {
  // ... esta rota está funcionando bem, sem necessidade de logs extras
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Link obrigatório' });

  const jobId = uuidv4();
  await downloadQueue.add(
    'download-video',
    { url, requestId: jobId },
    { jobId, timeout: 180000 }
  );
  res.status(202).json({ requestId: jobId, status: 'queued' });
});

router.get('/status/:id', async (req, res) => {
  const jobId = req.params.id;
  const job = await downloadQueue.getJob(jobId);

  if (!job) {
    return res.status(404).json({ status: 'not_found' });
  }

  const state = await job.getState();
  if (state === 'completed') {
    // ✅ LOG DE DEPURAÇÃO 1
    console.log(`[API /status] Job ${jobId} está completo. Avisando o frontend para iniciar o download.`);
  }

  res.json({
    status: state,
    reason: job.failedReason
  });
});

router.get('/download/:id', (req, res) => {
  const jobId = req.params.id;
  // ✅ LOG DE DEPURAÇÃO 2
  console.log(`[API /download] Recebido pedido para o arquivo do job: ${jobId}`);

  const filePath = path.join(DOWNLOAD_DIR, `${jobId}.mp4`);
  console.log(`[API /download] Procurando arquivo no caminho completo: ${filePath}`);

  // ✅ LOG DE DEPURAÇÃO 3: VERIFICAÇÃO MÁXIMA
  // Tenta listar o conteúdo do diretório para sabermos o que a API está vendo.
  try {
    const filesInDir = fs.readdirSync(DOWNLOAD_DIR);
    console.log(`[API /download] Conteúdo encontrado na pasta ${DOWNLOAD_DIR}:`, filesInDir);
  } catch (e) {
    console.error(`[API /download] ERRO ao tentar ler o diretório ${DOWNLOAD_DIR}:`, e.message);
  }

  if (fs.existsSync(filePath)) {
    console.log(`[API /download] ✅ Arquivo encontrado! Iniciando o envio para o cliente.`);
    res.download(filePath, (err) => {
      if (err) console.error(`Erro ao enviar o arquivo ${jobId}.mp4:`, err);
    });
  } else {
    console.error(`[API /download] ❌ ARQUIVO NÃO ENCONTRADO PELA API NO CAMINHO: ${filePath}`);
    res.status(404).json({ error: 'Arquivo não encontrado ou expirado.' });
  }
});

export default router;