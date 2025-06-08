# Backend API pour Gestion de Radios

API RESTful pour la gestion d'une collection de radios, développée avec Node.js, Express et MongoDB.

## Fonctionnalités

- Gestion complète des radios (CRUD)
- Validation des données
- Vérification des doublons (nom et URL de stream)
- Pagination et filtrage des résultats
- Optimisation des requêtes MongoDB
- Gestion des images
- Logs détaillés

## Prérequis

- Node.js (v14 ou supérieur)
- MongoDB
- npm ou yarn

## Installation

1. Cloner le repository :

   ```bash
   git clone <URL_DU_REPO>
   cd back-radios
   ```

2. Installer les dépendances :

   ```bash
   npm install
   ```

3. Configurer les variables d'environnement :
   Créer un fichier `.env` à la racine du projet avec les variables suivantes :

   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/radios
   ```

4. Démarrer le serveur :

   ```bash
   npm start
   ```

## Structure du Projet

```
.
├── index.js              # Point d'entrée de l'application
├── models/
│   └── Radio.js         # Modèle Mongoose pour les radios
├── routes/
│   └── radios.js        # Routes de l'API
├── middleware/
│   └── errorHandler.js  # Gestionnaire d'erreurs global
├── .env                 # Variables d'environnement
├── package.json
└── README.md
```

## API Endpoints

### GET /api/radios

Récupère la liste des radios avec pagination et filtrage.

Paramètres de requête :

- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre d'éléments par page (défaut: 10)
- `genre` : Filtre par genre
- `search` : Recherche par nom
- `sort` : Tri des résultats (défaut: 'name')

### POST /api/radios

Ajoute une nouvelle radio.

Corps de la requête (multipart/form-data) :

```json
{
  "image": "URL de l'image",
  "name": "Nom de la radio",
  "stream_url": "URL du stream",
  "genre": "Genre de la radio"
}
```

### PUT /api/radios/:id

Met à jour une radio existante.

Corps de la requête (multipart/form-data) :

```json
{
  "image": "URL de l'image",
  "name": "Nom de la radio",
  "stream_url": "URL du stream",
  "genre": "Genre de la radio"
}
```

### DELETE /api/radios/:id

Supprime une radio.

## Validation et Sécurité

- Vérification des champs requis
- Validation du format des données
- Vérification des doublons (nom et URL de stream)
- Gestion des erreurs globalisée
- Logs détaillés pour le debugging

## Optimisations

- Indexation MongoDB pour les recherches fréquentes
- Pagination pour les grandes collections
- Requêtes optimisées avec lean()
- Validation des données côté serveur
- Gestion efficace des erreurs

## Déploiement

Le projet est configuré pour être déployé sur Vercel. La configuration est définie dans le fichier `vercel.json`.

## Développement

Pour lancer le serveur en mode développement :

```bash
npm run dev
```

## Tests

Pour exécuter les tests :

```bash
npm test
```

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

MIT
