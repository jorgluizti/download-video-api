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
// import { Worker } from 'bullmq';
// import path from 'path';
// import fs from 'fs';
// import { execFile } from 'child_process';
// // Importamos a configuração específica do BullMQ
// import { bullmqConnectionConfig } from '../config/redis.js';

// const DOWNLOAD_DIR = path.join(process.cwd(), 'downloads');

// export function startDownloadWorker() {
//   const downloadWorker = new Worker('downloadQueue', async (job) => {
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
//     // Usamos a configuração aqui
//     connection: bullmqConnectionConfig,
//     concurrency: 6,
//   });

//   // ... seus listeners on('completed') e on('failed') continuam iguais ...
//   downloadWorker.on('completed', job => {
//     console.log(`✅ Job de download ${job.id} finalizado com sucesso`);
//   });

//   downloadWorker.on('failed', (job, err) => {
//     console.error(`❌ Job de download ${job.id} falhou: "${err.message}"`);
//     const filePath = path.join(DOWNLOAD_DIR, `${job.id}.mp4`);
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//       console.log(`🗑️ Limpando arquivo parcial de job falho: ${job.id}.mp4`);
//     }
//   });

//   console.log('▶️  Worker de Download iniciado e escutando a fila.');
// }

// 3.0

// import { Worker } from 'bullmq';
// import path from 'path';
// import fs from 'fs';
// import { execFile } from 'child_process';
// import { bullmqConnectionConfig } from '../config/redis.js';

// const DOWNLOAD_DIR = path.join(process.cwd(), 'downloads');

// export function startDownloadWorker() {
//   const downloadWorker = new Worker('downloadQueue', async (job) => {
//     // Caminho para o arquivo de cookies temporário, único para este job
//     const cookiesPath = path.join('/tmp', `cookies_${job.id}.txt`);

//     try {
//       // Pega o conteúdo dos cookies da variável de ambiente
//       const cookiesContent = process.env.INSTAGRAM_COOKIES;
//       if (!cookiesContent) {
//         throw new Error('Variável de ambiente INSTAGRAM_COOKIES não configurada.');
//       }

//       // Cria o arquivo de cookies temporário dentro do contêiner
//       fs.writeFileSync(cookiesPath, cookiesContent);

//       const { url, requestId } = job.data;
//       const outputPath = path.join(DOWNLOAD_DIR, `${requestId}.mp4`);

//       // Adiciona o argumento --cookies ao comando
//       const args = [
//         '--cookies', cookiesPath,
//         '-o', outputPath,
//         '--no-warnings',
//         url
//       ];

//       return await new Promise((resolve, reject) => {
//         execFile('yt-dlp', args, (error, stdout, stderr) => {
//           if (error) {
//             return reject(new Error(stderr || 'Erro desconhecido durante o download.'));
//           }
//           resolve({ message: 'Download completo' });
//         });
//       });

//     } finally {
//       // Bloco 'finally' garante que o arquivo de cookies temporário
//       // seja deletado, mesmo se o download falhar.
//       if (fs.existsSync(cookiesPath)) {
//         fs.unlinkSync(cookiesPath);
//       }
//     }
//   }, {
//     connection: bullmqConnectionConfig,
//     concurrency: 6,
//   });

//   // Seus listeners continuam aqui...
//   downloadWorker.on('completed', (job) => {
//     console.log(`✅ Job de download ${job.id} finalizado com sucesso`);
//   });

//   downloadWorker.on('failed', (job, err) => {
//     console.error(`❌ Job de download ${job.id} falhou: "${err.message}"`);
//     const filePath = path.join(DOWNLOAD_DIR, `${job.id}.mp4`);
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//       console.log(`🗑️ Limpando arquivo parcial de job falho: ${job.id}.mp4`);
//     }
//   });

//   console.log('▶️  Worker de Download iniciado e escutando a fila.');
// }


// 4.0 


// src/workers/downloadWorker.js
// import { Worker } from 'bullmq';
// import path from 'path';
// import fs from 'fs';
// import { execFile } from 'child_process';
// import { bullmqConnectionConfig } from '../config/redis.js';

// const DOWNLOAD_DIR = path.join(process.cwd(), 'downloads');

// export function startDownloadWorker() {
//   const downloadWorker = new Worker('downloadQueue', async (job) => {
//     // --- LOG DE DEPURAÇÃO 1 ---
//     console.log(`[WORKER] Job ${job.id} recebido! Iniciando processamento...`);

//     const cookiesPath = path.join('/tmp', `cookies_${job.id}.txt`);

//     try {
//       // --- INÍCIO DA LÓGICA DE COOKIES ---
//       const cookiesContent = process.env.INSTAGRAM_COOKIES;
//       if (!cookiesContent) {
//         // Se a variável não estiver configurada, o job falhará com uma mensagem clara.
//         throw new Error('Variável de ambiente INSTAGRAM_COOKIES não configurada.');
//       }
//       // Escreve o conteúdo da variável em um arquivo temporário para o yt-dlp ler.
//       fs.writeFileSync(cookiesPath, cookiesContent);
//       // --- FIM DA LÓGICA DE COOKIES ---

//       const { url, requestId } = job.data;
//       const outputPath = path.join(DOWNLOAD_DIR, `${requestId}.mp4`);

//       // Argumentos do comando, agora incluindo o caminho para o arquivo de cookies.
//       const args = [
//         '--cookies', cookiesPath,
//         '-o', outputPath,
//         '--no-warnings',
//         url
//       ];

//       // --- LOG DE DEPURAÇÃO 2 ---
//       // Logamos o comando para saber que a execução foi iniciada.
//       console.log(`[WORKER] Executando comando yt-dlp para o job ${job.id}...`);

//       return await new Promise((resolve, reject) => {
//         execFile('yt-dlp', args, (error, stdout, stderr) => {
//           if (error) {
//             return reject(new Error(stderr || 'Erro desconhecido durante o download.'));
//           }
//           resolve({ message: 'Download completo' });
//         });
//       });

//     } finally {
//       // Este bloco 'finally' é muito importante!
//       // Ele garante que o arquivo de cookies temporário seja deletado
//       // depois da tentativa de download, independentemente se deu certo ou falhou.
//       if (fs.existsSync(cookiesPath)) {
//         fs.unlinkSync(cookiesPath);
//       }
//     }
//   }, {
//     connection: bullmqConnectionConfig,
//     concurrency: 6,
//   });

//   // Listeners de eventos
//   downloadWorker.on('completed', (job) => {
//     console.log(`✅ Job de download ${job.id} finalizado com sucesso`);
//   });

//   downloadWorker.on('failed', (job, err) => {
//     console.error(`❌ Job de download ${job.id} falhou: "${err.message}"`);
//     const filePath = path.join(DOWNLOAD_DIR, `${job.id}.mp4`);
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//       console.log(`🗑️ Limpando arquivo parcial de job falho: ${job.id}.mp4`);
//     }
//   });

//   console.log('▶️  Worker de Download iniciado e escutando a fila.');
// }


// src/workers/downloadWorker.js
// import { Worker } from 'bullmq';
// import path from 'path';
// import fs from 'fs';
// import { execFile } from 'child_process';
// import { bullmqConnectionConfig } from '../config/redis.js';

// const DOWNLOAD_DIR = path.join(process.cwd(), 'downloads');

// // ✅ CAMINHO CORRETO PARA O ARQUIVO DENTRO DO PROJETO E DO CONTÊINER
// const cookiesPath = path.resolve(process.cwd(), 'src/config/cookies.txt');

// export function startDownloadWorker() {
//   const downloadWorker = new Worker('downloadQueue', async (job) => {
//     console.log(`[WORKER] Job ${job.id} recebido! Iniciando processamento...`);

//     // Verifica se o arquivo de cookies realmente existe no caminho esperado
//     if (!fs.existsSync(cookiesPath)) {
//       throw new Error(`Arquivo de cookies não encontrado no caminho: ${cookiesPath}`);
//     }

//     const { url, requestId } = job.data;
//     const outputPath = path.join(DOWNLOAD_DIR, `${requestId}.mp4`);

//     // Argumentos do comando, usando o caminho direto para o arquivo de cookies
//     const args = [
//       '--cookies', cookiesPath,
//       '-o', outputPath,
//       '--no-warnings',
//       url
//     ];

//     console.log(`[WORKER] Executando comando yt-dlp para o job ${job.id}...`);

//     return new Promise((resolve, reject) => {
//       execFile('yt-dlp', args, (error, stdout, stderr) => {
//         if (error) {
//           return reject(new Error(stderr || 'Erro desconhecido durante o download.'));
//         }
//         resolve({ message: 'Download completo' });
//       });
//     });
//   }, {
//     connection: bullmqConnectionConfig,
//     concurrency: 6,
//   });

//   // Seus listeners de eventos (on 'completed' e on 'failed')
//   downloadWorker.on('completed', job => { /* ... seu código aqui ... */ });
//   downloadWorker.on('failed', (job, err) => { /* ... seu código aqui ... */ });

//   console.log('▶️  Worker de Download iniciado e escutando a fila.');
// }

// src/workers/downloadWorker.js
import { Worker } from 'bullmq';
import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import { bullmqConnectionConfig } from '../config/redis.js';

const DOWNLOAD_DIR = path.join(process.cwd(), '/data/downloads');
const cookiesPath = path.resolve(process.cwd(), 'src/config/cookies.txt');

export function startDownloadWorker() {
  const downloadWorker = new Worker('downloadQueue', async (job) => {
    console.log(`[WORKER] Job ${job.id} recebido! Iniciando processamento...`);

    if (!fs.existsSync(cookiesPath)) {
      throw new Error(`Arquivo de cookies não encontrado no caminho: ${cookiesPath}`);
    }

    const { url, requestId } = job.data;
    const outputPath = path.join(DOWNLOAD_DIR, `${requestId}.mp4`);
    const args = ['--cookies', cookiesPath, '-o', outputPath, '--no-warnings', url];

    console.log(`[WORKER] Executando comando yt-dlp para o job ${job.id}...`);

    return new Promise((resolve, reject) => {
      execFile('yt-dlp', args, (error, stdout, stderr) => {
        if (error) {
          return reject(new Error(stderr || 'Erro desconhecido durante o download.'));
        }

        // ==========================================================
        //              INÍCIO DO NOVO BLOCO DE VERIFICAÇÃO
        // ==========================================================
        console.log('[WORKER] Comando yt-dlp finalizado sem código de erro. Verificando a existência do arquivo...');
        console.log(`[WORKER] Procurando por arquivo em: ${outputPath}`);

        if (fs.existsSync(outputPath)) {
          console.log(`[WORKER] ✅ Arquivo encontrado! Resolvendo o job como SUCESSO.`);
          resolve({ message: 'Download completo e arquivo verificado.' });
        } else {
          console.error(`[WORKER] ❌ ARQUIVO NÃO ENCONTRADO! O yt-dlp terminou, mas não criou o arquivo.`);

          // Tenta listar o conteúdo da pasta para depuração
          try {
            const filesInDir = fs.readdirSync(DOWNLOAD_DIR);
            console.log(`[WORKER] Conteúdo atual da pasta 'downloads':`, filesInDir);
          } catch (e) {
            console.error(`[WORKER] Não foi possível ler o diretório 'downloads':`, e);
          }

          reject(new Error('Falha pós-processamento: O arquivo de saída não foi criado pelo yt-dlp.'));
        }
        // ==========================================================
        //                FIM DO NOVO BLOCO DE VERIFICAÇÃO
        // ==========================================================
      });
    });
  }, {
    connection: bullmqConnectionConfig,
    concurrency: 6,
  });

  // Seus listeners ...
  downloadWorker.on('completed', job => { /* ... */ });
  downloadWorker.on('failed', (job, err) => { /* ... */ });

  console.log('▶️  Worker de Download iniciado e escutando a fila.');
}