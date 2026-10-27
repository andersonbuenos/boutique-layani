# Imagem otimizada para execução da Boutique Layani
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copia dependências e instala apenas pacotes de produção
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Copia a aplicação compilada e os módulos de backend (Build v2.6 Novas Roupas e Slides)
ARG BUILD_ID=20261026-v2.6
RUN echo "Building version $BUILD_ID"
COPY dist ./dist
COPY server ./server

EXPOSE 3001

CMD ["node", "server/index.js"]

