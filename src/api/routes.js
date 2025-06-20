// src/api/routes.js
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { extractionQueue } from '../config/queues.js'; // Usa a nova fila

const router = Router();

// A rota principal agora se chama 'extract' e espera os cookies do usuário
router.post('/extract', async (req, res) => {
  const { instagramUrl, userCookies } = req.body;

  if (!instagramUrl || !userCookies) {
    return res.status(400).json({ error: 'Os parâmetros "instagramUrl" e "userCookies" são obrigatórios.' });
  }

  const jobId = uuidv4();
  await extractionQueue.add(
    'extract-video-url',
    { instagramUrl, userCookies },
    { jobId, attempts: 2, backoff: 5000 } // Tenta 2 vezes em caso de falha
  );

  // Retorna apenas o ID do job para o frontend consultar o status
  res.status(202).json({ requestId: jobId, status: 'queued' });
});

// A rota de status agora retorna a URL direta quando o job é concluído
router.get('/status/:id', async (req, res) => {
  const jobId = req.params.id;
  const job = await extractionQueue.getJob(jobId);

  if (!job) {
    return res.status(404).json({ status: 'not_found' });
  }

  const state = await job.getState();
  res.json({
    status: state,
    reason: job.failedReason,
    // O resultado do job (returnvalue) agora contém a URL direta
    videoUrl: job.returnvalue?.directVideoUrl || null,
  });
});

// A rota GET /download não é mais necessária neste modelo.
// O app React Native irá baixar o 'videoUrl' diretamente.

export default router;