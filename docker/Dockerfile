# Utilisation d'une image Debian stable pour la compatibilité OpenSSL
FROM node:18-bullseye

# Installation des dépendances système requises par Prisma
RUN apt-get update && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Copie de tout le code source
COPY app/ .

# 2. --- NETTOYAGE BULLDOZER ---
# On supprime node_modules et le lockfile de Windows pour forcer une installation Linux propre
RUN rm -rf node_modules package-lock.json dist .nx

# 3. Installation fraîche des dépendances
RUN npm install

# 4. Génération du Client Prisma
# Indispensable pour que TypeScript connaisse les types (User, Article, Tag...)
RUN npx prisma generate --schema=./prisma/schema.prisma

# 5. Création du fichier manquant pour la compilation
# Cela évite l'erreur "File not found" pendant le build NX
RUN echo "import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient(); export default prisma;" > prisma/prisma-client.ts

# 6. --- BUILD DE PRODUCTION ---
# On compile le TypeScript en JavaScript dans le dossier dist/
RUN npx nx build api --skip-nx-cache

# 7. --- LE PATCH MAGIQUE ---
# Le build NX ne copie pas toujours les fichiers générés manuellement.
# On recrée donc le client Prisma directement dans le dossier de destination (dist),
# avec une double compatibilité d'export pour éviter les erreurs "undefined".
RUN mkdir -p dist/api/prisma && \
    echo "const { PrismaClient } = require('@prisma/client'); \
          const client = new PrismaClient(); \
          module.exports = client; \
          module.exports.default = client;" > dist/api/prisma/prisma-client.js

# 8. Configuration de l'environnement
EXPOSE 3000
ENV NODE_ENV=production
ENV NX_DAEMON=false

# 9. Démarrage
# On lance le fichier JavaScript compilé (beaucoup plus stable que nx serve)
CMD ["node", "dist/api/main.js"]