const taskService = require('../services/task.service');

/**
 * GET /api/v1/tasks
 * Devuelve todas las tareas.
 */
const getTasks = (req, res) => {
  const tasks = taskService.obtenerTodas();
  res.status(200).json(tasks);
};

/**
 * POST /api/v1/tasks
 * Crea una nueva tarea.
 */
const createTask = (req, res) => {
  const { text } = req.body;

  // Validación defensiva: text es obligatorio y debe ser un string no vacío
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'El campo text es obligatorio y no puede estar vacío' });
  }

  const tarea = taskService.crearTarea({ text: text.trim() });
  res.status(201).json(tarea);
};

/**
 * DELETE /api/v1/tasks/:id
 * Elimina una tarea por id.
 */
const deleteTask = (req, res) => {
  const id = Number(req.params.id);

  // Validación defensiva: el id debe ser un número válido
  if (isNaN(id)) {
    return res.status(400).json({ error: 'El id debe ser un número válido' });
  }

  try {
    taskService.eliminarTarea(id);
    res.status(204).send();
  } catch (error) {
    next(error) // se lo pasa al middleware global
  }
};

module.exports = { getTasks, createTask, deleteTask };
/*200 — todo bien
201 — creado correctamente
204 — borrado correctamente (sin contenido que devolver)
400 — los datos que mandaste están mal
404 — no encontrado
500 — error interno del servidor*/