// const express = require('express');
// const { Queue, Worker } = require('bullmq');
// const { v4: uuidv4 } = require('uuid');
// const Redis = require('ioredis');
// const fs = require('fs');
// const path = require('path');
// const { exec } = require('child_process');

// const app = express();
// // Middleware para parsing de JSON
// app.use(express.json());

// const redisConnection = new Redis({
//   host: 'localhost',
//   port: 6379,
//   maxRetriesPerRequest: null,  // <-- define aqui
//   enableReadyCheck: false,     // opcional, mas recomendado para BullMQ
// });

// const downloadQueue = new Queue('downloadQueue', { connection: redisConnection });

// const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
// if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR);

// app.post('/download', async (req, res) => {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: 'Link obrigatório' });

//   const requestId = uuidv4();
//   await downloadQueue.add('download-video', { url, requestId });
//   res.status(202).json({ requestId, status: 'queued' });
// });

// app.get('/status/:id', async (req, res) => {
//   const requestId = req.params.id;
//   const filePath = path.join(DOWNLOAD_DIR, `${requestId}.mp4`);

//   if (fs.existsSync(filePath)) {
//     return res.download(filePath);
//   } else {
//     return res.status(202).json({ status: 'processing' });
//   }
// });

// const worker = new Worker('downloadQueue', async job => {
//   const { url, requestId } = job.data;
//   const outputPath = path.join(DOWNLOAD_DIR, `${requestId}.mp4`);
//   // const command = `yt-dlp -o "${outputPath}" ${url}`;
//   const command = `"C:/downloads/yt-dlp.exe" -o "${outputPath}" ${url}`;

//   return new Promise((resolve, reject) => {
//     exec(command, (error) => {
//       if (error) {
//         console.error('Erro ao baixar:', error);
//         reject(error);
//       } else {
//         resolve({ message: 'Download completo' });
//       }
//     });
//   });
// }, { connection: redisConnection });

// worker.on('completed', job => {
//   console.log(`✅ Job ${job.id} finalizado com sucesso`);
// });

// worker.on('failed', (job, err) => {
//   console.error(`❌ Job ${job.id} falhou:`, err);
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 API rodando na porta ${PORT}`));


// 1.0

// const express = require('express');
// const { Queue, Worker } = require('bullmq');
// const { v4: uuidv4 } = require('uuid');
// const Redis = require('ioredis');
// const fs = require('fs');
// const path = require('path');
// const { exec } = require('child_process');

// const app = express();
// // Middleware para parsing de JSON
// app.use(express.json());

// const redisConnection = new Redis({
//   host: 'localhost',
//   port: 6379,
//   maxRetriesPerRequest: null,
//   enableReadyCheck: false,
// });

// const downloadQueue = new Queue('downloadQueue', { connection: redisConnection });

// const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
// if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR);

// app.post('/download', async (req, res) => {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: 'Link obrigatório' });

//   const requestId = uuidv4();
//   await downloadQueue.add('download-video', { url, requestId });
//   res.status(202).json({ requestId, status: 'queued' });
// });

// app.get('/status/:id', async (req, res) => {
//   const requestId = req.params.id;
//   const filePath = path.join(DOWNLOAD_DIR, `${requestId}.mp4`);

//   if (fs.existsSync(filePath)) {
//     return res.download(filePath);
//   } else {
//     return res.status(202).json({ status: 'processing' });
//   }
// });


// // ==============================================================================
// //  INÍCIO DA ALTERAÇÃO
// // ==============================================================================

// const worker = new Worker('downloadQueue', async job => {
//   const { url, requestId } = job.data;
//   const outputPath = path.join(DOWNLOAD_DIR, `${requestId}.mp4`);
//   const command = `"C:/downloads/yt-dlp.exe" -o "${outputPath}" ${url}`;

//   return new Promise((resolve, reject) => {
//     exec(command, (error) => {
//       if (error) {
//         console.error('Erro ao baixar:', error);
//         reject(error);
//       } else {
//         resolve({ message: 'Download completo' });
//       }
//     });
//   });
//   // O objeto de opções do Worker agora inclui a propriedade 'concurrency'
// }, {
//   connection: redisConnection,
//   concurrency: 6 // <-- ESTA É A LINHA ADICIONADA
// });

// // ==============================================================================
// //  FIM DA ALTERAÇÃO
// // ==============================================================================


// worker.on('completed', job => {
//   console.log(`✅ Job ${job.id} finalizado com sucesso`);
// });

// worker.on('failed', (job, err) => {
//   console.error(`❌ Job ${job.id} falhou:`, err);
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 API rodando na porta ${PORT}`));


// 2.0

// const express = require('express');
// const { Queue, Worker } = require('bullmq');
// const { v4: uuidv4 } = require('uuid');
// const Redis = require('ioredis');
// const fs = require('fs');
// const path = require('path');
// const { exec } = require('child_process');

// const app = express();
// // Middleware para parsing de JSON
// app.use(express.json());

// const redisConnection = new Redis({
//   host: 'localhost',
//   port: 6379,
//   maxRetriesPerRequest: null,
//   enableReadyCheck: false,
// });

// const downloadQueue = new Queue('downloadQueue', { connection: redisConnection });

// const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
// if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR);


// // ==============================================================================
// //  INÍCIO DA ALTERAÇÃO
// // ==============================================================================

// app.post('/download', async (req, res) => {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: 'Link obrigatório' });

//   const requestId = uuidv4();

//   // Adicionamos um terceiro argumento à função .add() com as opções do job
//   await downloadQueue.add(
//     'download-video', // Nome do job
//     { url, requestId }, // Dados do job
//     {
//       timeout: 180000 // <-- ESTA É A OPÇÃO ADICIONADA (3 minutos em ms)
//     }
//   );

//   res.status(202).json({ requestId, status: 'queued' });
// });

// // ==============================================================================
// //  FIM DA ALTERAÇÃO
// // ==============================================================================


// app.get('/status/:id', async (req, res) => {
//   const requestId = req.params.id;
//   const filePath = path.join(DOWNLOAD_DIR, `${requestId}.mp4`);

//   if (fs.existsSync(filePath)) {
//     return res.download(filePath);
//   } else {
//     return res.status(202).json({ status: 'processing' });
//   }
// });

// const worker = new Worker('downloadQueue', async job => {
//   const { url, requestId } = job.data;
//   const outputPath = path.join(DOWNLOAD_DIR, `${requestId}.mp4`);
//   const command = `"C:/downloads/yt-dlp.exe" -o "${outputPath}" ${url}`;

//   return new Promise((resolve, reject) => {
//     exec(command, (error) => {
//       if (error) {
//         console.error('Erro ao baixar:', error);
//         reject(error);
//       } else {
//         resolve({ message: 'Download completo' });
//       }
//     });
//   });
// }, {
//   connection: redisConnection,
//   concurrency: 6
// });

// worker.on('completed', job => {
//   console.log(`✅ Job ${job.id} finalizado com sucesso`);
// });

// worker.on('failed', (job, err) => {
//   // Agora, jobs que estourarem o timeout também acionarão este evento
//   console.error(`❌ Job ${job.id} falhou:`, err);
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 API rodando na porta ${PORT}`));


// 3.0

// const express = require('express');
// const { Queue, Worker } = require('bullmq');
// const { v4: uuidv4 } = require('uuid');
// const Redis = require('ioredis');
// const fs = require('fs');
// const path = require('path');
// const { exec } = require('child_process');

// const app = express();
// app.use(express.json());

// const redisConnection = new Redis({
//   host: 'localhost',
//   port: 6379,
//   maxRetriesPerRequest: null,
//   enableReadyCheck: false,
// });

// const downloadQueue = new Queue('downloadQueue', { connection: redisConnection });

// const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
// if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR);

// app.post('/download', async (req, res) => {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: 'Link obrigatório' });

//   // ==============================================================================
//   //  ALTERAÇÃO 1: Usar o ID como 'jobId' para fácil recuperação
//   // ==============================================================================
//   const jobId = uuidv4(); // Este será nosso ID único para o job e a requisição

//   await downloadQueue.add(
//     'download-video',
//     { url, requestId: jobId }, // Passamos o ID aqui para o worker saber o nome do arquivo
//     {
//       jobId: jobId,       // Usamos o ID como jobId no BullMQ
//       timeout: 180000     // Timeout de 3 minutos
//     }
//   );

//   // Retornamos o jobId para o cliente, que ele usará como 'requestId'
//   res.status(202).json({ requestId: jobId, status: 'queued' });
// });


// // ==============================================================================
// //  ALTERAÇÃO 2: Rota de status agora consulta o BullMQ
// // ==============================================================================
// app.get('/status/:id', async (req, res) => {
//   const jobId = req.params.id;
//   const job = await downloadQueue.getJob(jobId);

//   if (!job) {
//     return res.status(404).json({ status: 'not_found', message: 'Job não encontrado.' });
//   }

//   const state = await job.getState();

//   switch (state) {
//     case 'completed':
//       // O job terminou, o frontend agora sabe que pode chamar a rota de download
//       res.json({ status: 'completed' });
//       break;
//     case 'failed':
//       // O job falhou, retornamos o motivo da falha para o frontend
//       res.json({ status: 'failed', reason: job.failedReason });
//       break;
//     default:
//       // 'active', 'waiting', 'delayed' são todos considerados 'processing' pelo frontend
//       res.json({ status: 'processing' });
//       break;
//   }
// });


// // ==============================================================================
// //  ALTERAÇÃO 3: Nova rota dedicada para o download do arquivo
// // ==============================================================================
// app.get('/download/:id', (req, res) => {
//   const jobId = req.params.id;
//   const filePath = path.join(DOWNLOAD_DIR, `${jobId}.mp4`);

//   if (fs.existsSync(filePath)) {
//     res.download(filePath);
//   } else {
//     res.status(404).json({ error: 'Arquivo não encontrado.' });
//   }
// });


// // ==============================================================================
// //  ALTERAÇÃO 4: Worker agora captura e rejeita com o erro real do yt-dlp
// // ==============================================================================
// const worker = new Worker('downloadQueue', async job => {
//   // O 'requestId' aqui vem dos dados do job, e é o mesmo que o 'jobId'
//   const { url, requestId } = job.data;
//   const outputPath = path.join(DOWNLOAD_DIR, `${requestId}.mp4`);
//   const command = `"C:/downloads/yt-dlp.exe" -o "${outputPath}" "${url}"`; // URL entre aspas por segurança

//   return new Promise((resolve, reject) => {
//     // Adicionamos 'stderr' ao callback para capturar as mensagens de erro
//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         // Muitas vezes, a mensagem de erro útil do yt-dlp está no stderr
//         console.error(`Falha no job ${job.id}:`, stderr || error.message);
//         // Rejeitamos a Promise com uma mensagem de erro limpa para o usuário
//         reject(new Error(stderr || 'Ocorreu um erro desconhecido durante o download.'));
//       } else {
//         resolve({ message: 'Download completo' });
//       }
//     });
//   });
// }, {
//   connection: redisConnection,
//   concurrency: 6
// });


// worker.on('completed', job => {
//   console.log(`✅ Job ${job.id} finalizado com sucesso`);
// });

// worker.on('failed', (job, err) => {
//   console.error(`❌ Job ${job.id} falhou com o motivo: "${err.message}"`);
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 API rodando na porta ${PORT}`));



// 4.0


// const express = require('express');
// const { Queue, Worker } = require('bullmq');
// const { v4: uuidv4 } = require('uuid');
// const Redis = require('ioredis');
// const fs = require('fs');
// const path = require('path');
// const { exec } = require('child_process');

// const app = express();
// app.use(express.json());

// const redisConnection = new Redis({
//   host: 'localhost',
//   port: 6379,
//   maxRetriesPerRequest: null,
//   enableReadyCheck: false,
// });

// // ==============================================================================
// //  ALTERAÇÃO 1: Fila dedicada para a limpeza
// // ==============================================================================
// const downloadQueue = new Queue('downloadQueue', { connection: redisConnection });
// const cleanupQueue = new Queue('cleanupQueue', { connection: redisConnection });

// const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
// if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR);

// // --- API Endpoints ---
// app.post('/download', async (req, res) => {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: 'Link obrigatório' });

//   const jobId = uuidv4();
//   await downloadQueue.add(
//     'download-video',
//     { url, requestId: jobId },
//     { jobId: jobId, timeout: 180000 }
//   );
//   res.status(202).json({ requestId: jobId, status: 'queued' });
// });

// app.get('/status/:id', async (req, res) => {
//   const jobId = req.params.id;
//   const job = await downloadQueue.getJob(jobId);

//   if (!job) {
//     return res.status(404).json({ status: 'not_found', message: 'Job não encontrado.' });
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

// app.get('/download/:id', (req, res) => {
//   const jobId = req.params.id;
//   const filePath = path.join(DOWNLOAD_DIR, `${jobId}.mp4`);

//   if (fs.existsSync(filePath)) {
//     res.download(filePath, (err) => {
//       // Opcional: Logar erro se o envio do arquivo falhar
//       if (err) {
//         console.error(`Erro ao enviar o arquivo ${jobId}.mp4 para o cliente:`, err);
//       }
//     });
//   } else {
//     res.status(404).json({ error: 'Arquivo não encontrado ou expirado.' });
//   }
// });

// // --- Workers ---

// const downloadWorker = new Worker('downloadQueue', async job => {
//   const { url, requestId } = job.data;
//   const outputPath = path.join(DOWNLOAD_DIR, `${requestId}.mp4`);
//   const command = `"C:/downloads/yt-dlp.exe" -o "${outputPath}" "${url}"`;

//   return new Promise((resolve, reject) => {
//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         reject(new Error(stderr || 'Ocorreu um erro desconhecido durante o download.'));
//       } else {
//         resolve({ message: 'Download completo' });
//       }
//     });
//   });
// }, {
//   connection: redisConnection,
//   concurrency: 6
// });

// // ==============================================================================
// //  ALTERAÇÃO 2: Novo worker e agendamento da limpeza
// // ==============================================================================

// // Worker cuja única função é limpar arquivos antigos da pasta de downloads
// const cleanupWorker = new Worker('cleanupQueue', async job => {
//   console.log('🧹 Executando tarefa de limpeza de arquivos antigos...');
//   const files = fs.readdirSync(DOWNLOAD_DIR);
//   const now = Date.now();
//   const MAX_AGE_MS = 3600 * 1000; // Tempo de vida de 1 hora em milissegundos

//   for (const file of files) {
//     // Garante que estamos lidando apenas com os arquivos de vídeo
//     if (path.extname(file) === '.mp4') {
//       const filePath = path.join(DOWNLOAD_DIR, file);
//       const stat = fs.statSync(filePath);
//       const fileAge = now - stat.mtime.getTime();

//       if (fileAge > MAX_AGE_MS) {
//         console.log(`🗑️ Deletando arquivo expirado: ${file}`);
//         fs.unlinkSync(filePath);
//       }
//     }
//   }
//   return { message: 'Limpeza concluída.' };
// }, { connection: redisConnection });

// // Função que agenda a tarefa de limpeza para rodar repetidamente
// const scheduleCleanup = async () => {
//   await cleanupQueue.add('hourly-cleanup', {}, {
//     repeat: {
//       // Executa a tarefa a cada hora (ex: 13:00, 14:00, 15:00)
//       pattern: '0 * * * *',
//     },
//     jobId: 'main-cleanup-job', // ID fixo para evitar duplicação
//     removeOnComplete: true,    // Remove o job da lista de 'completed'
//     removeOnFail: true,        // Remove o job da lista de 'failed'
//   });
//   console.log('🧼 Tarefa de limpeza agendada para rodar a cada hora.');
// };

// // --- Listeners de Eventos ---
// downloadWorker.on('completed', job => {
//   console.log(`✅ Job de download ${job.id} finalizado com sucesso`);
// });

// downloadWorker.on('failed', (job, err) => {
//   console.error(`❌ Job de download ${job.id} falhou: "${err.message}"`);
//   // ALTERAÇÃO 3: Limpeza imediata de arquivos parciais de jobs que falharam
//   const filePath = path.join(DOWNLOAD_DIR, `${job.id}.mp4`);
//   if (fs.existsSync(filePath)) {
//     fs.unlinkSync(filePath);
//     console.log(`🗑️ Limpando arquivo parcial de job falho: ${job.id}.mp4`);
//   }
// });

// // --- Início do Servidor ---
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 API rodando na porta ${PORT}`);
//   // ALTERAÇÃO 4: A função de agendamento é chamada quando o servidor sobe
//   scheduleCleanup();
// });



// 5.0 

const express = require('express');
const { Queue, Worker } = require('bullmq');
const { v4: uuidv4 } = require('uuid');
const Redis = require('ioredis');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const rateLimit = require('express-rate-limit');

const app = express();
app.set('trust proxy', 1);

app.use(express.json());

// Aplica o limitador de taxa a todas as requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Janela de 15 minutos
  max: 100, // Limita cada IP a 100 requisições por janela
  standardHeaders: true, // Retorna a informação do limite nos cabeçalhos `RateLimit-*`
  legacyHeaders: false, // Desabilita os cabeçalhos antigos `X-RateLimit-*`
  message: 'Muitas requisições enviadas deste IP, por favor tente novamente após 15 minutos.'
});

app.use(limiter); // O middleware é aplicado aqui

const redisConnection = new Redis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// ==============================================================================
//  ALTERAÇÃO 1: Fila dedicada para a limpeza
// ==============================================================================
const downloadQueue = new Queue('downloadQueue', { connection: redisConnection });
const cleanupQueue = new Queue('cleanupQueue', { connection: redisConnection });

const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR);

// --- API Endpoints ---
app.post('/download', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Link obrigatório' });

  const jobId = uuidv4();
  await downloadQueue.add(
    'download-video',
    { url, requestId: jobId },
    { jobId: jobId, timeout: 180000 }
  );
  res.status(202).json({ requestId: jobId, status: 'queued' });
});

app.get('/status/:id', async (req, res) => {
  const jobId = req.params.id;
  const job = await downloadQueue.getJob(jobId);

  if (!job) {
    return res.status(404).json({ status: 'not_found', message: 'Job não encontrado.' });
  }

  const state = await job.getState();
  switch (state) {
    case 'completed':
      res.json({ status: 'completed' });
      break;
    case 'failed':
      res.json({ status: 'failed', reason: job.failedReason });
      break;
    default:
      res.json({ status: 'processing' });
      break;
  }
});

app.get('/download/:id', (req, res) => {
  const jobId = req.params.id;
  const filePath = path.join(DOWNLOAD_DIR, `${jobId}.mp4`);

  if (fs.existsSync(filePath)) {
    res.download(filePath, (err) => {
      // Opcional: Logar erro se o envio do arquivo falhar
      if (err) {
        console.error(`Erro ao enviar o arquivo ${jobId}.mp4 para o cliente:`, err);
      }
    });
  } else {
    res.status(404).json({ error: 'Arquivo não encontrado ou expirado.' });
  }
});

// --- Workers ---

const downloadWorker = new Worker('downloadQueue', async job => {
  const { url, requestId } = job.data;
  const outputPath = path.join(DOWNLOAD_DIR, `${requestId}.mp4`);
  const command = `"C:/downloads/yt-dlp.exe" -o "${outputPath}" "${url}"`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || 'Ocorreu um erro desconhecido durante o download.'));
      } else {
        resolve({ message: 'Download completo' });
      }
    });
  });
}, {
  connection: redisConnection,
  concurrency: 6
});

// ==============================================================================
//  ALTERAÇÃO 2: Novo worker e agendamento da limpeza
// ==============================================================================

// Worker cuja única função é limpar arquivos antigos da pasta de downloads
const cleanupWorker = new Worker('cleanupQueue', async job => {
  console.log('🧹 Executando tarefa de limpeza de arquivos antigos...');
  const files = fs.readdirSync(DOWNLOAD_DIR);
  const now = Date.now();
  const MAX_AGE_MS = 3600 * 1000; // Tempo de vida de 1 hora em milissegundos

  for (const file of files) {
    // Garante que estamos lidando apenas com os arquivos de vídeo
    if (path.extname(file) === '.mp4') {
      const filePath = path.join(DOWNLOAD_DIR, file);
      const stat = fs.statSync(filePath);
      const fileAge = now - stat.mtime.getTime();

      if (fileAge > MAX_AGE_MS) {
        console.log(`🗑️ Deletando arquivo expirado: ${file}`);
        fs.unlinkSync(filePath);
      }
    }
  }
  return { message: 'Limpeza concluída.' };
}, { connection: redisConnection });

// Função que agenda a tarefa de limpeza para rodar repetidamente
const scheduleCleanup = async () => {
  await cleanupQueue.add('hourly-cleanup', {}, {
    repeat: {
      // Executa a tarefa a cada hora (ex: 13:00, 14:00, 15:00)
      pattern: '0 * * * *',
    },
    jobId: 'main-cleanup-job', // ID fixo para evitar duplicação
    removeOnComplete: true,    // Remove o job da lista de 'completed'
    removeOnFail: true,        // Remove o job da lista de 'failed'
  });
  console.log('🧼 Tarefa de limpeza agendada para rodar a cada hora.');
};

// --- Listeners de Eventos ---
downloadWorker.on('completed', job => {
  console.log(`✅ Job de download ${job.id} finalizado com sucesso`);
});

downloadWorker.on('failed', (job, err) => {
  console.error(`❌ Job de download ${job.id} falhou: "${err.message}"`);
  // ALTERAÇÃO 3: Limpeza imediata de arquivos parciais de jobs que falharam
  const filePath = path.join(DOWNLOAD_DIR, `${job.id}.mp4`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🗑️ Limpando arquivo parcial de job falho: ${job.id}.mp4`);
  }
});

// --- Início do Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
  // ALTERAÇÃO 4: A função de agendamento é chamada quando o servidor sobe
  scheduleCleanup();
});