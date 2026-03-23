const { PORT } = require('./config/env');
const express = require('express');
const cors = require('cors');
 
const app = express();
 
app.use(cors());
app.use(express.json());
 
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});