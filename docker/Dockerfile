# Utilisation d'une image Debian stable pour la compatibilité OpenSSL
FROM node:18-bullseye

# Installation des dépendances système requises par Prisma
RUN apt-get update && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Copie de tout le code source
COPY app/ .

# 2. Nettoyage TOTAL pour éviter les conflits avec vos fichiers Windows/Mac
# On supprime node_modules, dist, et le cache NX
RUN rm -rf node_modules package-lock.json dist .nx

# 3. Installation fraîche des dépendances
RUN npm install

# 4. Génération du Client Prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

# 5. Création du fichier manquant pour satisfaire la compilation TypeScript
RUN echo "import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient(); export default prisma;" > prisma/prisma-client.ts

# 6. --- BUILD DE PRODUCTION ---
# On compile le TypeScript en JavaScript dans le dossier dist/
RUN npx nx build api --skip-nx-cache

# 7. --- LE PATCH MAGIQUE ---
# C'est l'étape CRUCIALE qui manque actuellement.
# On crée manuellement le fichier prisma-client.js là où l'application compilée le cherche.
# On ajoute une double compatibilité (export et export.default) pour éviter les erreurs.
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
# IMPORTANT : On lance le fichier compilé (node), PAS le serveur de dev (nx serve)
CMD ["node", "dist/api/main.js"]