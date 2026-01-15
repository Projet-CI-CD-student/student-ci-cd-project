FROM node:18-bullseye

# Installation des libs système nécessaires pour Prisma
RUN apt-get update && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. On copie TOUT le dossier 'app' (code + prisma + package.json + lockfile)
COPY app/ .

# 2. --- NETTOYAGE TOTAL (LA CLÉ DU SUCCÈS) ---
# On supprime node_modules ET package-lock.json à l'intérieur de l'image.
# On force Docker à recalculer les dépendances pour Linux, sans hériter de vos bugs locaux.
RUN rm -rf node_modules package-lock.json dist .nx

# 3. Installation fraîche (crée une structure propre)
RUN npm install

# 4. Fix du fichier manquant (pour apaiser TypeScript si besoin)
RUN echo "import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient(); export default prisma;" > prisma/prisma-client.ts

# 5. Génération Explicite du Client Prisma
# On pointe bien vers le fichier de schéma copié
RUN npx prisma generate --schema=./prisma/schema.prisma

# 6. Exposition
EXPOSE 3000

ENV NX_DAEMON=false

# 7. Démarrage
# On régénère encore une fois au lancement pour être sûr à 100%
CMD sh -c "npx prisma generate --schema=./prisma/schema.prisma && npx nx serve api --host=0.0.0.0 --skip-nx-cache"