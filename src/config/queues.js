// src/config/queues.js
import { Queue } from 'bullmq';
import { bullmqConnectionConfig } from './redis.js';

// Agora só precisamos de uma fila para as tarefas de extração
export const extractionQueue = new Queue('extractionQueue', { connection: bullmqConnectionConfig });