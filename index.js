require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('=>Connecté sur Radios!'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Radio API');
});
app.use('/api/radios', require('./routes/radios'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));