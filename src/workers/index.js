// # Ponto de entrada para iniciar TODOS os workers

// console.log('Iniciando processos de worker...');

// // Importar os arquivos dos workers para que eles comecem a escutar as filas
// import './downloadWorker.js';
// import './cleanupWorker.js';

// console.log('Todos os workers estão rodando e escutando as filas.');

// src/workers/index.js
import { startDownloadWorker } from './downloadWorker.js';
import { startCleanupWorker } from './cleanupWorker.js';

console.log('Iniciando processos de worker...');

// Inicia os dois workers
startDownloadWorker();
startCleanupWorker();

console.log('Todos os workers estão rodando e escutando as filas.');