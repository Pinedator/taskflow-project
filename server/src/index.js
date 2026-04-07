const { PORT } = require('./config/env');
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/task.routes')
 
const app = express();
 
app.use(cors());
app.use(express.json());

app.use('/api/v1/tasks', taskRoutes)
 
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});