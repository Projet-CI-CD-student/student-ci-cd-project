#!/bin/bash

# Configuration de base
COLOR=${COLOR:-blue}

# --- LOGIQUE DES PORTS ---
# Doit correspondre EXACTEMENT à votre docker-compose.yml
if [ "$COLOR" == "blue" ]; then
    HOST_PORT=3001
else
    HOST_PORT=3002
fi

export HOST_PORT
export COLOR

echo " Lancement du deploiement : Cible $COLOR sur le port hote $HOST_PORT"

# 1. Pull de la derniere image
docker pull melvyn92/app:latest

# 2. Demarrage du conteneur
# On force les variables pour être sûr que docker compose les reçoive
HOST_PORT=$HOST_PORT COLOR=$COLOR docker compose -f docker/docker-compose.yml up -d --pull always $COLOR

# 3. Attente
echo " Attente du demarrage de la version $COLOR (60s)..."
sleep 60

# 4. Verification de sante (MODIFIÉE)
# On teste la racine '/' car elle ne dépend pas de la DB. Si ça répond 200, le serveur est vivant.
TARGET_URL="http://127.0.0.1:$HOST_PORT/"

echo " Test de l'URL : $TARGET_URL"

# On utilise curl -v (verbose) pour voir ce qui se passe si ça échoue
# On cherche un code 200 OK
if curl -v --fail "$TARGET_URL"; then
    echo " Succes : La version $COLOR repond correctement."
    
    # 5. Application des migrations
    echo " Application des migrations DB..."
    docker compose -f docker/docker-compose.yml exec -T $COLOR npx prisma migrate deploy

    echo " Deploiement termine avec succes !"
    exit 0
else
    echo " Echec du deploiement de $COLOR."
    echo " Le test curl a echoué. Voici la réponse du serveur :"
    # On refait le curl sans le check pour afficher le retour (erreur 500, etc)
    curl -v "$TARGET_URL"
    
    echo " Logs du conteneur :"
    docker compose -f docker/docker-compose.yml logs $COLOR

    # On arrete le conteneur qui vient d'echouer
    docker compose -f docker/docker-compose.yml stop $COLOR
    exit 1
fi