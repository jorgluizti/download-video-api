// //  # Configura e exporta a conexão com o Redis

// // src/config/redis.js
// import Redis from 'ioredis';

// // Lê a URL do Redis a partir das variáveis de ambiente (ideal para deploy)
// // Se não encontrar, usa o localhost como padrão para desenvolvimento local.
// const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// const redisConnection = new Redis(redisUrl, {
//   maxRetriesPerRequest: null,
//   enableReadyCheck: false,
// });

// redisConnection.on('connect', () => console.log('🔌 Conectado ao Redis'));
// redisConnection.on('error', (err) => console.error('❌ Erro de conexão com o Redis:', err));

// export default redisConnection;



import Redis from 'ioredis';

// 1. Tenta pegar a URL do ambiente.
const redisUrl = process.env.REDIS_URL;

// 2. Verifica se a variável foi encontrada.
if (!redisUrl) {
  // Se estivermos em produção e a URL não existir, é um erro crítico.
  if (process.env.NODE_ENV === 'production') {
    throw new Error('A variável de ambiente REDIS_URL não está configurada!');
  }
  // Se não estiver em produção, podemos alertar e usar um fallback para desenvolvimento local.
  console.warn('⚠️  Variável REDIS_URL não encontrada. Usando conexão local com Redis.');
  // Defina o fallback aqui, se necessário, embora seja melhor definir no seu .env local.
  // Para este caso, vamos deixar o ioredis usar o padrão 'localhost:6379'.
}

// 3. Cria a conexão. Se redisUrl for undefined, ioredis usa 'localhost'.
// Se redisUrl tiver um valor (como na Railway), ele o usará.
const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  // Esta opção não é mais estritamente necessária nas versões mais recentes do ioredis.
  // enableReadyCheck: false, 
});

redisConnection.on('connect', () => {
  // Extrai o host para sabermos onde estamos conectados
  const host = redisConnection.options.host || 'localhost';
  console.log(`🔌 Conectado ao Redis em ${host}`);
});

redisConnection.on('error', (err) => {
  console.error('❌ Erro de conexão com o Redis:', err.message);
});

export default redisConnection;