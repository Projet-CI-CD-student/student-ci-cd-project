FROM node:18-bullseye

RUN apt-get update && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY app/ .

# Nettoyage
RUN rm -rf node_modules package-lock.json dist .nx

# Install
RUN npm install

# Prisma Generate
RUN npx prisma generate --schema=./prisma/schema.prisma

# Patch compilation TypeScript
RUN echo "import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient(); export default prisma;" > prisma/prisma-client.ts

# Build (CRUCIAL)
RUN npx nx build api --skip-nx-cache

# Patch exécution Production
RUN mkdir -p dist/api/prisma && \
    echo "const { PrismaClient } = require('@prisma/client'); \
          const client = new PrismaClient(); \
          module.exports = client; \
          module.exports.default = client;" > dist/api/prisma/prisma-client.js

EXPOSE 3000
ENV NODE_ENV=production
ENV NX_DAEMON=false

# Démarrage : Migration DB + Serveur Node
CMD sh -c "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/api/main.js"