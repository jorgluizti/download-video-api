# Passo 1: Usar uma imagem base oficial do Node.js (versão slim é menor)
FROM node:20-slim

# Passo 2: Instalar dependências do sistema e o yt-dlp via apt-get
RUN apt-get update && apt-get install -y --no-install-recommends python3 yt-dlp && \
    # Limpa o cache para manter a imagem pequena
    rm -rf /var/lib/apt/lists/*

# Passo 3: Preparar o diretório de trabalho dentro do contêiner
WORKDIR /app

# Passo 4: Copiar os arquivos de dependência e instalar
# Isso aproveita o cache do Docker. Ele só reinstala se o package.json mudar.
COPY package*.json ./
RUN npm install --production

# Passo 5: Copiar todo o resto do código da sua aplicação
COPY . .

# Passo 6: Expor a porta que a API irá usar
EXPOSE 3000

# NOTA: Não vamos definir um CMD aqui. Ele será definido na plataforma de deploy.

CMD ["node", "src/api/server.js"]