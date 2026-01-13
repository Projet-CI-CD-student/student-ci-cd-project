# Stage 1: Construction
FROM node:18-bullseye-slim AS builder

# Installation des dépendances système nécessaires pour Prisma et la compilation
RUN apt-get update && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# On copie les fichiers de dépendances depuis le dossier app/
COPY app/package*.json ./
RUN npm install

# On copie tout le reste du code source
COPY app/ .

# Génération du client Prisma (important pour les types)
RUN npx prisma generate

# Stage 2: Image finale (plus légère)
FROM node:18-bullseye-slim

WORKDIR /usr/src/app

# Installation de openssl (requis par Prisma runtime)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# On récupère tout ce qui a été construit dans le stage builder
COPY --from=builder /usr/src/app ./

# On expose le port 3000
EXPOSE 3000

# Commande de démarrage : 
# 1. Déploiement des migrations sur la DB
# 2. Lancement de l'API en forçant l'écoute sur 0.0.0.0
CMD npx prisma migrate deploy && npx nx serve api --host=0.0.0.0