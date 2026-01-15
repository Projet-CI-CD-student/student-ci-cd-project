FROM node:18-bullseye

# Installation des outils système
RUN apt-get update && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Copie des fichiers
COPY app/ .

# 2. Nettoyage
RUN rm -rf node_modules package-lock.json dist .nx

# 3. Installation
RUN npm install

# 4. Génération Prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

# 5. Fichier Prisma Client factice
RUN echo "import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient(); export default prisma;" > prisma/prisma-client.ts

# 6. Build
RUN npx nx build api --skip-nx-cache

# 7. Patch Prisma
RUN mkdir -p dist/api/prisma && \
    echo "const { PrismaClient } = require('@prisma/client'); \
          const client = new PrismaClient(); \
          module.exports = client; \
          module.exports.default = client;" > dist/api/prisma/prisma-client.js

# 8. Env
EXPOSE 3000
ENV NODE_ENV=production
ENV NX_DAEMON=false

# 9. Démarrage (MODIFIÉ)
# On lance d'abord les migrations pour créer les tables, PUIS on démarre le serveur.
CMD sh -c "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/api/main.js"