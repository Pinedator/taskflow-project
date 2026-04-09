let tasks = [];

const obtenerTodas = () => tasks;

const crearTarea = (data) => {
  const tarea = { id: Date.now(), text: data.text, completed: false };
  tasks.push(tarea);
  return tarea;
};

const eliminarTarea = (id) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) throw new Error('NOT_FOUND');
  tasks.splice(index, 1);
};

const toggleTarea = (id) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) throw new Error('NOT_FOUND');
  task.completed = !task.completed;
  return task;
};

const editarTarea = (id, text) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) throw new Error('NOT_FOUND');
  task.text = text;
  return task;
};

module.exports = { obtenerTodas, crearTarea, eliminarTarea, toggleTarea, editarTarea };