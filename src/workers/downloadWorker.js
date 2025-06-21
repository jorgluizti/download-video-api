// src/workers/downloadWorker.js
import { Worker } from 'bullmq';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';
import { bullmqConnectionConfig } from '../config/redis.js';

// --- Configuração do Cliente S3 para o Cloudflare R2 ---
const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://<SEU_ACCOUNT_ID>.r2.cloudflarestorage.com`, // ⚠️ SUBSTITUA PELO SEU ACCOUNT ID
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const TEMP_DIR = path.join(process.cwd(), 'temp_downloads');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

export function startDownloadWorker() {
  const downloadWorker = new Worker('downloadQueue', async (job) => {
    console.log(`[DOWNLOADER] Job ${job.id} recebido! (Tentativa ${job.attemptsMade + 1})`);
    const { instagramUrl, userCookies } = job.data;

    const tempCookiesPath = path.join(TEMP_DIR, `cookies_${job.id}.txt`);
    const tempVideoPath = path.join(TEMP_DIR, `video_${job.id}.mp4`);

    try {
      // 1. Cria o arquivo de cookies temporário
      fs.writeFileSync(tempCookiesPath, userCookies);

      // 2. Usa yt-dlp para BAIXAR o vídeo para o disco do worker
      console.log(`[DOWNLOADER] Baixando vídeo para o worker...`);
      await new Promise((resolve, reject) => {
        execFile('yt-dlp', ['--cookies', tempCookiesPath, '-o', tempVideoPath, instagramUrl], (error) => {
          if (error) return reject(error);
          resolve();
        });
      });

      console.log(`[DOWNLOADER] Vídeo baixado. Fazendo upload para o R2...`);

      // 3. Faz o UPLOAD do vídeo baixado para o Cloudflare R2
      const fileStream = fs.createReadStream(tempVideoPath);
      const objectKey = `video-${job.id}.mp4`; // Nome do arquivo no R2

      await R2.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectKey,
        Body: fileStream,
        ContentType: 'video/mp4',
      }));

      console.log(`[DOWNLOADER] ✅ Upload para R2 concluído. Chave: ${objectKey}`);

      // 4. Retorna a chave do objeto para o cliente saber qual arquivo pedir
      return { objectKey };

    } catch (error) {
      console.error(`[DOWNLOADER] Erro no job ${job.id}:`, error);
      // Lança o erro para o BullMQ saber que falhou
      throw error;
    } finally {
      // 5. Limpa os arquivos temporários do disco do worker
      if (fs.existsSync(tempCookiesPath)) fs.unlinkSync(tempCookiesPath);
      if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath);
      console.log(`[DOWNLOADER] Arquivos temporários do job ${job.id} limpos.`);
    }
  }, {
    connection: bullmqConnectionConfig,
    concurrency: 5 // Processa até 5 downloads ao mesmo tempo
  });

  downloadWorker.on('completed', (job, result) => {
    console.log(`[DOWNLOADER] Job ${job.id} concluído com sucesso. Resultado:`, result);
  });

  downloadWorker.on('failed', (job, err) => {
    console.error(`[DOWNLOADER] ❌ Job ${job.id} falhou:`, err.message);
  });

  console.log('▶️  Worker de Download e Upload para R2 iniciado.');
}