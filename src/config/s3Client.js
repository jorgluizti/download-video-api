// src/config/s3Client.js
import { S3Client } from '@aws-sdk/client-s3';
import 'dotenv/config'; // Carrega as variáveis do .env

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  throw new Error("Credenciais do R2 não configuradas nas variáveis de ambiente.");
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com`.replace('<R2_ACCOUNT_ID>', R2_ACCOUNT_ID),
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export default s3Client;