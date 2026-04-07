const { PORT } = require('./config/env');
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/task.routes')
 
const app = express();
 
app.use(cors());
app.use(express.json());

app.use('/api/v1/tasks', taskRoutes)
 
// Middleware global de errores — siempre al final
app.use((err, req, res, next) => {
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }

  // Para cualquier otro error no controlado
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});