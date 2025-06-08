//  # Configura e exporta a conexão com o Redis

// src/config/redis.js
import Redis from 'ioredis';

// Lê a URL do Redis a partir das variáveis de ambiente (ideal para deploy)
// Se não encontrar, usa o localhost como padrão para desenvolvimento local.
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redisConnection.on('connect', () => console.log('🔌 Conectado ao Redis'));
redisConnection.on('error', (err) => console.error('❌ Erro de conexão com o Redis:', err));

export default redisConnection;