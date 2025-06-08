const express = require('express');
const router = express.Router();
const multer = require('multer');
const { check, validationResult } = require('express-validator');
const Radio = require('../models/Radio');

const upload = multer();

// @route   GET api/radios
// @desc    Get all radios
// @access  Public
router.get('/', async (req, res) => {
  try {
    const radios = await Radio.find();
    res.json(radios);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/radios
// @desc    Create a radio
// @access  Public
router.post(
  '/',
  [
    upload.none(),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('stream_url', 'Stream URL is required').not().isEmpty(),
      check('image', 'Image is required').not().isEmpty(),
      check('genre', 'Genre is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, stream_url, image, genre } = req.body;

    try {
      const newRadio = new Radio({
        name,
        stream_url,
        image,
        genre,
      });

      const radio = await newRadio.save();
      res.json(radio);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/radios/:id
// @desc    Update a radio
// @access  Public
router.put('/:id', upload.none(), async (req, res) => {
  const { name, stream_url, image, genre } = req.body;

  // Build radio object
  const radioFields = {};
  if (name) radioFields.name = name;
  if (stream_url) radioFields.stream_url = stream_url;
  if (image) radioFields.image = image;
  if (genre) radioFields.genre = genre;

  try {
    let radio = await Radio.findById(req.params.id);

    if (!radio) return res.status(404).json({ msg: 'Radio not found' });

    radio = await Radio.findByIdAndUpdate(
      req.params.id,
      { $set: radioFields },
      { new: true }
    );

    res.json(radio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/radios/:id
// @desc    Delete a radio
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    let radio = await Radio.findById(req.params.id);

    if (!radio) return res.status(404).json({ msg: 'Radio not found' });

    await Radio.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Radio removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;