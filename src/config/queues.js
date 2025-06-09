// //  # Configura e exporta as filas do BullMQ// src/config/queues.js

// import { Queue } from 'bullmq';
// import redisConnection from './redis.js';

// export const downloadQueue = new Queue('downloadQueue', { connection: redisConnection });
// export const cleanupQueue = new Queue('cleanupQueue', { connection: redisConnection });

// src/config/queues.js
import { Queue } from 'bullmq';
// Importamos a configuração específica do BullMQ
import { bullmqConnectionConfig } from './redis.js';

export const downloadQueue = new Queue('downloadQueue', { connection: bullmqConnectionConfig });
export const cleanupQueue = new Queue('cleanupQueue', { connection: bullmqConnectionConfig });