const express = require('express');
const router = express.Router();
const Radio = require('../models/Radio');
const multer = require('multer');
const upload = multer();

// Fonction utilitaire pour vérifier les champs requis
const checkBody = (body, fields) => {
  for (const field of fields) {
    if (!body[field]) {
      return false;
    }
  }
  return true;
};

// GET toutes les radios avec pagination et filtrage
router.get('/', async (req, res) => {
  console.log('---------------------GET all radios---------------------');
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const genre = req.query.genre;
    const search = req.query.search;
    const sort = req.query.sort || 'name';

    let query = {};
    if (genre) {
      query.genre = genre;
    }
    if (search) {
      query.name = { $regex: new RegExp(search, 'i') };
    }

    const skip = (page - 1) * limit;

    // Utilisation de Promise.all pour exécuter les requêtes en parallèle
    const [radios, total] = await Promise.all([
      Radio.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(), // Utilisation de lean() pour des résultats plus rapides
      Radio.countDocuments(query)
    ]);

    console.log('Radios trouvées:', radios.length);
    res.json({ 
      result: true, 
      data: radios,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Erreur GET /:', err);
    res.json({ result: false, error: err.message });
  }
});

// POST une nouvelle radio
router.post('/', upload.none(), async (req, res) => {
  console.log('---------------------POST new radio---------------------');
  console.log('Données reçues:', req.body);

  if (!checkBody(req.body, ['image', 'name', 'stream_url', 'genre'])) {
    console.log('Champs manquants');
    res.json({ result: false, error: 'Tous les champs sont requis: image, name, stream_url, genre' });
    return;
  }

  try {
    const { image, name, stream_url, genre } = req.body;

    // Vérification du nom (insensible à la casse)
    const existingName = await Radio.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    }).lean();

    if (existingName) {
      console.log('Radio avec ce nom existe déjà:', existingName);
      res.json({ 
        result: false, 
        error: 'Une radio avec ce nom existe déjà',
        existingRadio: {
          name: existingName.name,
          genre: existingName.genre
        }
      });
      return;
    }

    // Vérification de l'URL de stream
    const existingStream = await Radio.findByStreamUrl(stream_url);
    if (existingStream) {
      console.log('Radio avec cette URL de stream existe déjà:', existingStream);
      res.json({ 
        result: false, 
        error: 'Une radio avec cette URL de stream existe déjà',
        existingRadio: {
          name: existingStream.name,
          genre: existingStream.genre
        }
      });
      return;
    }

    const radio = new Radio({ image, name, stream_url, genre });
    console.log('Nouvelle radio à créer:', radio);

    const newRadio = await radio.save();
    console.log('Radio créée avec succès:', newRadio);
    res.json({ result: true, data: newRadio });
  } catch (err) {
    console.error('Erreur POST /:', err);
    res.json({ 
      result: false, 
      error: err.message,
      details: err.errors ? Object.values(err.errors).map(e => e.message) : []
    });
  }
});

// PUT (update) une radio
router.put('/:id', upload.none(), async (req, res) => {
  console.log('---------------------PUT update radio---------------------');
  console.log('ID:', req.params.id);
  console.log('Nouvelles données:', req.body);

  if (!checkBody(req.body, ['image', 'name', 'stream_url', 'genre'])) {
    console.log('Champs manquants dans la mise à jour');
    res.json({ result: false, error: 'Tous les champs sont requis: image, name, stream_url, genre' });
    return;
  }

  try {
    const { image, name, stream_url, genre } = req.body;

    // Vérification du nom (insensible à la casse)
    const existingName = await Radio.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: req.params.id }
    }).lean();

    if (existingName) {
      console.log('Une autre radio utilise déjà ce nom:', existingName);
      res.json({ 
        result: false, 
        error: 'Une autre radio utilise déjà ce nom',
        existingRadio: {
          name: existingName.name,
          genre: existingName.genre
        }
      });
      return;
    }

    // Vérification de l'URL de stream
    const existingStream = await Radio.findOne({ 
      stream_url,
      _id: { $ne: req.params.id }
    }).lean();

    if (existingStream) {
      console.log('Une autre radio utilise déjà cette URL de stream:', existingStream);
      res.json({ 
        result: false, 
        error: 'Une autre radio utilise déjà cette URL de stream',
        existingRadio: {
          name: existingStream.name,
          genre: existingStream.genre
        }
      });
      return;
    }

    const radio = await Radio.findByIdAndUpdate(
      req.params.id,
      { image, name, stream_url, genre },
      { 
        new: true, 
        runValidators: true,
        lean: true // Utilisation de lean() pour des résultats plus rapides
      }
    );
    
    if (!radio) {
      console.log('Radio non trouvée pour mise à jour');
      res.json({ result: false, error: 'Radio non trouvée' });
      return;
    }
    
    console.log('Radio mise à jour avec succès:', radio);
    res.json({ result: true, data: radio });
  } catch (err) {
    console.error('Erreur PUT /:id:', err);
    res.json({ 
      result: false, 
      error: err.message,
      details: err.errors ? Object.values(err.errors).map(e => e.message) : []
    });
  }
});

// DELETE une radio
router.delete('/:id', async (req, res) => {
  console.log('---------------------DELETE radio---------------------');
  console.log('ID:', req.params.id);

  try {
    const radio = await Radio.findByIdAndDelete(req.params.id).lean();
    if (!radio) {
      console.log('Radio non trouvée pour suppression');
      res.json({ result: false, error: 'Radio non trouvée' });
      return;
    }
    console.log('Radio supprimée avec succès');
    res.json({ result: true, message: 'Radio supprimée avec succès' });
  } catch (err) {
    console.error('Erreur DELETE /:id:', err);
    res.json({ result: false, error: err.message });
  }
});

module.exports = router; 