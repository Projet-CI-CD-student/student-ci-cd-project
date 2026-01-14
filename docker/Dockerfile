# On utilise une image Node.js solide
FROM node:18-bullseye

# Installation des dépendances système (OpenSSL requis par Prisma)
RUN apt-get update && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Copie des fichiers de dépendances
COPY app/package*.json ./

# 2. Installation complète
RUN npm install

# 3. Copie du code source
COPY app/ .

# --- 🚑 FIX FICHIER MANQUANT 🚑 ---
# On recrée le fichier prisma-client.ts
RUN echo "import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient(); export default prisma;" > prisma/prisma-client.ts

# 4. GÉNÉRATION CRITIQUE (BUILD TIME)
# On génère les types maintenant pour qu'ils soient prêts avant le démarrage
RUN npx prisma generate

# 5. Exposition du port
EXPOSE 3000

# 6. DÉMARRAGE SANS CACHE
# On ajoute --skip-nx-cache pour forcer NX à relire les types que Prisma vient de créer
CMD sh -c "npx prisma generate && npx nx serve api --host=0.0.0.0 --skip-nx-cache"