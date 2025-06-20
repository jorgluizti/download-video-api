// src/workers/extractionWorker.js
import { Worker } from 'bullmq';
import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import { bullmqConnectionConfig } from '../config/redis.js';

const TEMP_DIR = path.join(process.cwd(), 'temp_downloads');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

export function startExtractionWorker() {
  const extractionWorker = new Worker('extractionQueue', async (job) => {
    console.log(`[EXTRACTOR] Job ${job.id} recebido!`);

    const { instagramUrl, userCookies } = job.data;
    const tempCookiesPath = path.join(TEMP_DIR, `cookies_${job.id}.txt`);

    if (!userCookies) {
      throw new Error('Cookies do usuário não fornecidos para o job.');
    }

    try {
      // Cria o arquivo de cookies temporário com o conteúdo recebido do app
      fs.writeFileSync(tempCookiesPath, userCookies);

      // Comando para o yt-dlp APENAS obter a URL do vídeo
      const args = [
        '--cookies', tempCookiesPath,
        '--get-url', // A flag mágica para não baixar o vídeo
        instagramUrl
      ];

      console.log(`[EXTRACTOR] Executando yt-dlp para obter a URL do job ${job.id}...`);

      const directVideoUrl = await new Promise((resolve, reject) => {
        execFile('yt-dlp', args, (error, stdout, stderr) => {
          if (error) return reject(new Error(stderr || 'Erro ao extrair URL com yt-dlp.'));
          // A saída (stdout) do comando será a própria URL
          resolve(stdout.trim());
        });
      });

      console.log(`[EXTRACTOR] ✅ URL extraída com sucesso: ${directVideoUrl}`);
      // Retorna a URL direta como resultado do job
      return { directVideoUrl };

    } finally {
      // Deleta o arquivo de cookies temporário
      if (fs.existsSync(tempCookiesPath)) {
        fs.unlinkSync(tempCookiesPath);
      }
    }
  }, {
    connection: bullmqConnectionConfig,
    concurrency: 10 // Podemos aumentar a concorrência, pois a tarefa é muito mais leve
  });

  // Listeners...
  extractionWorker.on('completed', (job, result) => {
    console.log(`✅ Job de extração ${job.id} finalizado.`);
  });
  extractionWorker.on('failed', (job, err) => {
    console.error(`❌ Job de extração ${job.id} falhou: "${err.message}"`);
  });

  console.log('▶️  Worker de Extração de URL iniciado.');
}