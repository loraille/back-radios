const mongoose = require('mongoose');

const radioSchema = new mongoose.Schema({
  image: { 
    type: String, 
    required: true,
    index: true // Index pour les recherches par image
  },
  name: { 
    type: String, 
    required: true,
    index: true // Index pour les recherches par nom
  },
  stream_url: { 
    type: String, 
    required: true,
    unique: true, // Index unique pour éviter les doublons
    index: true
  },
  genre: { 
    type: String, 
    required: true,
    index: true // Index pour les recherches par genre
  }
}, {
  timestamps: true // Ajoute createdAt et updatedAt automatiquement
});

// Index composé pour les recherches fréquentes
radioSchema.index({ genre: 1, name: 1 });

// Méthode statique pour la recherche optimisée
radioSchema.statics.findByGenre = function(genre) {
  return this.find({ genre }).lean(); // .lean() pour des résultats plus rapides
};

// Méthode statique pour la recherche par nom (insensible à la casse)
radioSchema.statics.findByName = function(name) {
  return this.find({ 
    name: { $regex: new RegExp(name, 'i') } 
  }).lean();
};

// Méthode statique pour la recherche par stream_url
radioSchema.statics.findByStreamUrl = function(stream_url) {
  return this.findOne({ stream_url }).lean();
};

const Radio = mongoose.model('Radio', radioSchema);

// Création des index en arrière-plan
Radio.createIndexes().catch(console.error);

module.exports = Radio; 