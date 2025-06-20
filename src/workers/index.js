// src/workers/index.js
import { startExtractionWorker } from './extractionWorker.js';

console.log('Iniciando processos de worker (V2)...');
startExtractionWorker();
console.log('Worker de Extração está rodando.');