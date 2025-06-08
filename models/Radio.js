const mongoose = require('mongoose');

const RadioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  stream_url: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Radio', RadioSchema);