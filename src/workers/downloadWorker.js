// // # Lógica do worker de download e seus listeners

// import { Worker } from 'bullmq';
// import path from 'path';
// import fs from 'fs';
// import { execFile } from 'child_process';
// import redisConnection from '../config/redis.js';

// const DOWNLOAD_DIR = path.join(process.cwd(), 'downloads');

// const downloadWorker = new Worker('downloadQueue', async (job) => {
//   const { url, requestId } = job.data;
//   const outputPath = path.join(DOWNLOAD_DIR, `${requestId}.mp4`);
//   const args = ['-o', outputPath, '--no-warnings', url];

//   return new Promise((resolve, reject) => {
//     execFile('yt-dlp', args, (error, stdout, stderr) => {
//       if (error) {
//         return reject(new Error(stderr || 'Erro desconhecido durante o download.'));
//       }
//       resolve({ message: 'Download completo' });
//     });
//   });
// }, {
//   connection: redisConnection,
//   concurrency: 6,
// });

// downloadWorker.on('completed', job => {
//   console.log(`✅ Job de download ${job.id} finalizado com sucesso`);
// });

// downloadWorker.on('failed', (job, err) => {
//   console.error(`❌ Job de download ${job.id} falhou: "${err.message}"`);
//   const filePath = path.join(DOWNLOAD_DIR, `${job.id}.mp4`);
//   if (fs.existsSync(filePath)) {
//     fs.unlinkSync(filePath);
//     console.log(`🗑️ Limpando arquivo parcial de job falho: ${job.id}.mp4`);
//   }
// });

// console.log('▶️  Worker de Download iniciado.');

// 1.0

// src/workers/downloadWorker.js
// import { Worker } from 'bullmq';
// import path from 'path';
// import fs from 'fs';
// import { execFile } from 'child_process';
// import redisConnection from '../config/redis.js';

// const DOWNLOAD_DIR = path.join(process.cwd(), 'downloads');

// export function startDownloadWorker() {
//   const downloadWorker = new Worker('downloadQueue', async (job) => {
//     // ... a lógica do download continua a mesma
//     const { url, requestId } = job.data;
//     const outputPath = path.join(DOWNLOAD_DIR, `${requestId}.mp4`);
//     const args = ['-o', outputPath, '--no-warnings', url];

//     return new Promise((resolve, reject) => {
//       execFile('yt-dlp', args, (error, stdout, stderr) => {
//         if (error) {
//           return reject(new Error(stderr || 'Erro desconhecido durante o download.'));
//         }
//         resolve({ message: 'Download completo' });
//       });
//     });
//   }, {
//     connection: redisConnection,
//     concurrency: 6,
//   });

//   downloadWorker.on('completed', job => {
//     console.log(`✅ Job de download ${job.id} finalizado com sucesso`);
//   });

//   downloadWorker.on('failed', (job, err) => {
//     console.error(`❌ Job de download <span class="math-inline">\{job\.id\} falhou\: "</span>{err.message}"`);
//     const filePath = path.join(DOWNLOAD_DIR, `${job.id}.mp4`);
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//       console.log(`🗑️ Limpando arquivo parcial de job falho: ${job.id}.mp4`);
//     }
//   });

//   console.log('▶️  Worker de Download iniciado e escutando a fila.');
// }

// 2.0

// src/workers/downloadWorker.js
import { Worker } from 'bullmq';
import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
// Importamos a configuração específica do BullMQ
import { bullmqConnectionConfig } from '../config/redis.js';

const DOWNLOAD_DIR = path.join(process.cwd(), 'downloads');

export function startDownloadWorker() {
  const downloadWorker = new Worker('downloadQueue', async (job) => {
    const { url, requestId } = job.data;
    const outputPath = path.join(DOWNLOAD_DIR, `${requestId}.mp4`);
    const args = ['-o', outputPath, '--no-warnings', url];

    return new Promise((resolve, reject) => {
      execFile('yt-dlp', args, (error, stdout, stderr) => {
        if (error) {
          return reject(new Error(stderr || 'Erro desconhecido durante o download.'));
        }
        resolve({ message: 'Download completo' });
      });
    });
  }, {
    // Usamos a configuração aqui
    connection: bullmqConnectionConfig,
    concurrency: 6,
  });

  // ... seus listeners on('completed') e on('failed') continuam iguais ...
  downloadWorker.on('completed', job => {
    console.log(`✅ Job de download ${job.id} finalizado com sucesso`);
  });

  downloadWorker.on('failed', (job, err) => {
    console.error(`❌ Job de download ${job.id} falhou: "${err.message}"`);
    const filePath = path.join(DOWNLOAD_DIR, `${job.id}.mp4`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Limpando arquivo parcial de job falho: ${job.id}.mp4`);
    }
  });

  console.log('▶️  Worker de Download iniciado e escutando a fila.');
}