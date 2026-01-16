FROM node:18-bullseye

RUN apt-get update && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY app/ .

# 1. Nettoyage radical (On supprime aussi le cache NX local s'il a été copié)
RUN rm -rf node_modules package-lock.json dist .nx

RUN npm install

RUN npx prisma generate --schema=./prisma/schema.prisma

# Patch TS
RUN echo "import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient(); export default prisma;" > prisma/prisma-client.ts

# 2. BUILD FORCÉ (Ajout de --skip-nx-cache ET reset avant)
RUN npx nx reset && npx nx build api --skip-nx-cache

# Patch JS
RUN mkdir -p dist/api/prisma && \
    echo "const { PrismaClient } = require('@prisma/client'); \
          const client = new PrismaClient(); \
          module.exports = client; \
          module.exports.default = client;" > dist/api/prisma/prisma-client.js

EXPOSE 3000
ENV NODE_ENV=production
ENV NX_DAEMON=false

# Démarrage
CMD sh -c "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/api/main.js"