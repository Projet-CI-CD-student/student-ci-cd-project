# On utilise une image Node.js solide
FROM node:18-bullseye

# Installation des dependances systeme (OpenSSL pour Prisma)
RUN apt-get update && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Copie des fichiers de dependances
COPY app/package*.json ./

# 2. Installation complete des modules
RUN npm install

# 3. Copie de tout le code source
COPY app/ .


# On recree le fichier prisma-client.ts
RUN echo "import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient(); export default prisma;" > prisma/prisma-client.ts

# 4. Exposition du port
EXPOSE 3000


# A) npx prisma generate -> Pour être sûr à 100% que les types existent
# B) npx nx serve      -> Pour lancer l'app
CMD sh -c "npx prisma generate && npx nx serve api --host=0.0.0.0"