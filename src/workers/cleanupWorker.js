// # Lógica do worker de limpeza e agendamento

// import { Worker } from 'bullmq';
// import path from 'path';
// import fs from 'fs';
// import redisConnection from '../config/redis.js';
// import { cleanupQueue } from '../config/queues.js';

// const DOWNLOAD_DIR = path.join(process.cwd(), 'downloads');

// const cleanupWorker = new Worker('cleanupQueue', async (job) => {
//   console.log('🧹 Executando tarefa de limpeza de arquivos antigos...');
//   const files = fs.readdirSync(DOWNLOAD_DIR);
//   const now = Date.now();
//   const MAX_AGE_MS = 3600 * 1000; // 1 hora

//   for (const file of files) {
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

// export async function scheduleCleanup() {
//   await cleanupQueue.add('hourly-cleanup', {}, {
//     repeat: { pattern: '0 * * * *' },
//     jobId: 'main-cleanup-job',
//     removeOnComplete: true,
//     removeOnFail: true,
//   });
//   console.log('🧼 Tarefa de limpeza agendada para rodar a cada hora.');
// }

// console.log('▶️  Worker de Limpeza iniciado.');

// 1.0

// import { Worker } from 'bullmq';
// import path from 'path';
// import fs from 'fs';
// import redisConnection from '../config/redis.js';
// import { cleanupQueue } from '../config/queues.js';

// const DOWNLOAD_DIR = path.join(process.cwd(), 'downloads');

// export function startCleanupWorker() {
//   const cleanupWorker = new Worker('cleanupQueue', async (job) => {
//     console.log('🧹 Executando tarefa de limpeza de arquivos antigos...');
//     // ... lógica de limpeza continua a mesma ...
//     const files = fs.readdirSync(DOWNLOAD_DIR);
//     const now = Date.now();
//     const MAX_AGE_MS = 3600 * 1000;

//     for (const file of files) {
//       if (path.extname(file) === '.mp4') {
//         const filePath = path.join(DOWNLOAD_DIR, file);
//         const stat = fs.statSync(filePath);
//         const fileAge = now - stat.mtime.getTime();
//         if (fileAge > MAX_AGE_MS) {
//           console.log(`🗑️ Deletando arquivo expirado: ${file}`);
//           fs.unlinkSync(filePath);
//         }
//       }
//     }
//     return { message: 'Limpeza concluída.' };
//   }, { connection: redisConnection });

//   console.log('▶️  Worker de Limpeza iniciado e escutando a fila.');
// }

// export async function scheduleCleanup() {
//   await cleanupQueue.add('hourly-cleanup', {}, {
//     repeat: { pattern: '0 * * * *' },
//     jobId: 'main-cleanup-job',
//     removeOnComplete: true,
//     removeOnFail: true,
//   });
//   console.log('🧼 Tarefa de limpeza agendada para rodar a cada hora.');
// }

// 2.0

// src/workers/cleanupWorker.js
// import { Worker } from 'bullmq';
// import path from 'path';
// import fs from 'fs';
// // Importamos a configuração específica do BullMQ
// import { bullmqConnectionConfig } from '../config/redis.js';
// import { cleanupQueue } from '../config/queues.js';

// const DOWNLOAD_DIR = path.resolve('/data/downloads');

// export function startCleanupWorker() {
//   const cleanupWorker = new Worker('cleanupQueue', async (job) => {
//     console.log('🧹 Executando tarefa de limpeza de arquivos antigos...');
//     // ... lógica de limpeza continua a mesma ...
//     const files = fs.readdirSync(DOWNLOAD_DIR);
//     const now = Date.now();
//     const MAX_AGE_MS = 3600 * 1000;

//     for (const file of files) {
//       if (path.extname(file) === '.mp4') {
//         const filePath = path.join(DOWNLOAD_DIR, file);
//         const stat = fs.statSync(filePath);
//         const fileAge = now - stat.mtime.getTime();
//         if (fileAge > MAX_AGE_MS) {
//           console.log(`🗑️ Deletando arquivo expirado: ${file}`);
//           fs.unlinkSync(filePath);
//         }
//       }
//     }
//     return { message: 'Limpeza concluída.' };
//   }, {
//     // Usamos a configuração aqui
//     connection: bullmqConnectionConfig
//   });

//   console.log('▶️  Worker de Limpeza iniciado e escutando a fila.');
// }

// export async function scheduleCleanup() {
//   // ... a lógica de agendamento continua a mesma ...
//   await cleanupQueue.add('hourly-cleanup', {}, {
//     repeat: { pattern: '0 * * * *' },
//     jobId: 'main-cleanup-job',
//     removeOnComplete: true,
//     removeOnFail: true,
//   });
//   console.log('🧼 Tarefa de limpeza agendada para rodar a cada hora.');
// }


// src/workers/cleanupWorker.js
import { Worker } from 'bullmq';
import { bullmqConnectionConfig } from '../config/redis.js';
import { cleanupQueue } from '../config/queues.js';
import s3Client from '../config/s3Client.js';
import { ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';

export function startCleanupWorker() {
  const cleanupWorker = new Worker('cleanupQueue', async (job) => {
    console.log('🧹 Executando tarefa de limpeza de arquivos antigos no R2...');

    const BUCKET_NAME = process.env.R2_BUCKET_NAME;
    if (!BUCKET_NAME) {
      throw new Error("R2_BUCKET_NAME não está configurado.");
    }

    const MAX_AGE_MS = 3600 * 1000; // 1 hora
    const now = Date.now();
    let isTruncated = true;
    let continuationToken;
    let deletedCount = 0;

    // Loop para lidar com paginação (caso você tenha muitos arquivos no bucket)
    while (isTruncated) {
      const listCommand = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        ContinuationToken: continuationToken,
      });

      const listResponse = await s3Client.send(listCommand);
      const { Contents, IsTruncated, NextContinuationToken } = listResponse;

      if (Contents && Contents.length > 0) {
        for (const object of Contents) {
          // Compara a data de modificação com a data atual
          const fileAge = now - object.LastModified.getTime();

          if (fileAge > MAX_AGE_MS) {
            console.log(`🗑️ Deletando objeto expirado do R2: ${object.Key}`);

            // Cria e envia o comando de deleção
            const deleteCommand = new DeleteObjectCommand({
              Bucket: BUCKET_NAME,
              Key: object.Key,
            });
            await s3Client.send(deleteCommand);
            deletedCount++;
          }
        }
      }

      isTruncated = IsTruncated;
      continuationToken = NextContinuationToken;
    }

    const resultMessage = `Limpeza do R2 concluída. ${deletedCount} objetos deletados.`;
    console.log(resultMessage);
    return { message: resultMessage };

  }, {
    connection: bullmqConnectionConfig
  });

  console.log('▶️  Worker de Limpeza (R2) iniciado e escutando a fila.');
}

// A função de agendamento não muda nada.
export async function scheduleCleanup() {
  await cleanupQueue.add('hourly-cleanup', {}, {
    repeat: { pattern: '0 * * * *' },
    jobId: 'main-cleanup-job',
    removeOnComplete: true,
    removeOnFail: true,
  });
  console.log('🧼 Tarefa de limpeza para o R2 agendada para rodar a cada hora.');
}