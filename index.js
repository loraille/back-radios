require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const upload = multer();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});

// Configuration de la connexion MongoDB avec plus de détails
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log('Connecté à MongoDB avec succès');
    console.log('Base de données:', mongoose.connection.db.databaseName);
  })
  .catch(err => {
    console.error('Erreur de connexion MongoDB:', err);
    process.exit(1);
  });

// Gestion des erreurs de connexion MongoDB
mongoose.connection.on('error', err => {
  console.error('Erreur MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Déconnecté de MongoDB');
});

app.use('/api/radios', require('./routes/radios'));

// Gestion du port avec fallback
const port = 3000;
app.listen(port, () => {
  console.log(`Serveur lancé sur le port ${port}`);
  console.log(`API disponible sur http://localhost:${port}/api/radios`);
}); 