FROM node:18-bullseye

# Installation des outils système
RUN apt-get update && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Copie des fichiers
COPY app/ .

# 2. Nettoyage et Installation
RUN rm -rf node_modules package-lock.json dist .nx
RUN npm install

# 3. Génération Prisma (Indispensable)
RUN npx prisma generate --schema=./prisma/schema.prisma

# 4. Création du fichier TS pour que le Build passe (Satisfaction du compilateur)
RUN echo "import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient(); export default prisma;" > prisma/prisma-client.ts

# 5. --- ÉTAPE DE BUILD EXPLICITE ---
# On compile l'application TypeScript en JavaScript (dossier dist/)
RUN npx nx build api --skip-nx-cache

# 6. --- LE PATCH FINAL (Magie) ---
# Le build ne copie pas le fichier prisma-client, donc on le recrée manuellement
# en version JavaScript directement là où l'application le cherche.
RUN mkdir -p dist/api/prisma && \
    echo "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); module.exports = prisma;" > dist/api/prisma/prisma-client.js

# 7. Configuration
EXPOSE 3000
ENV NODE_ENV=production
ENV NX_DAEMON=false

# 8. Démarrage (On lance directement le fichier compilé)
# Plus de 'nx serve', on lance le vrai fichier JS de prod.
CMD ["node", "dist/api/main.js"]