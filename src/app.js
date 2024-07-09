require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

// Configurar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
