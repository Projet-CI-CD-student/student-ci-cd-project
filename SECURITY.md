# Gestion de la Sécurité

## Secrets GitHub
Les variables suivantes doivent être ajoutées dans "Repository Secrets" :
- \`DATABASE_URL\` : postgresql://admin:password@db:5432/conduit
- \`JWT_SECRET\` : Une chaîne aléatoire sécurisée

## Protection
- Aucun fichier .env n'est commité.
- Utilisation d'images Docker "slim" pour réduire la surface d'attaque.