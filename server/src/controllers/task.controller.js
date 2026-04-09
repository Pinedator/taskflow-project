const taskService = require('../services/task.service');

const getTasks = (req, res) => {
  const tasks = taskService.obtenerTodas();
  res.status(200).json(tasks);
};

const createTask = (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'El campo text es obligatorio y no puede estar vacío' });
  }
  const tarea = taskService.crearTarea({ text: text.trim() });
  res.status(201).json(tarea);
};

const deleteTask = (req, res, next) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'El id debe ser un número válido' });
  try {
    taskService.eliminarTarea(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const toggleTask = (req, res, next) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'El id debe ser un número válido' });
  try {
    const tarea = taskService.toggleTarea(id);
    res.status(200).json(tarea);
  } catch (error) {
    next(error);
  }
};

const editTask = (req, res, next) => {
  const id = Number(req.params.id);
  const { text } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: 'El id debe ser un número válido' });
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'El campo text es obligatorio' });
  }
  try {
    const tarea = taskService.editarTarea(id, text.trim());
    res.status(200).json(tarea);
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, deleteTask, toggleTask, editTask };