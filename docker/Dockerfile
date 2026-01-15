FROM node:18-bullseye

# Installation des outils système
RUN apt-get update && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. On copie TOUT le dossier 'app'
COPY app/ .

# 2. NETTOYAGE TOTAL : On supprime les conflits potentiels (node_modules, lockfile)
RUN rm -rf node_modules package-lock.json dist .nx

# 3. Installation fraîche
RUN npm install

# 4. Génération Prisma (avec le bon schema)
RUN npx prisma generate --schema=./prisma/schema.prisma

# 5. Création du fichier dummy (au cas où)
RUN echo "import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient(); export default prisma;" > prisma/prisma-client.ts

# 6. Configuration
EXPOSE 3000
ENV NX_DAEMON=false

# 7. Démarrage
CMD sh -c "npx prisma generate --schema=./prisma/schema.prisma && npx nx serve api --host=0.0.0.0 --skip-nx-cache"
