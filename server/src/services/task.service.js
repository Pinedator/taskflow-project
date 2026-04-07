// Persistencia simulada en memoria (más adelante será una base de datos)
let tasks = [];

/**
 * Devuelve todas las tareas.
 */
const obtenerTodas = () => {
  return tasks;
};

/**
 * Crea una nueva tarea y la añade al array.
 * @param {{ text: string }} data
 */
const crearTarea = (data) => {
  const tarea = {
    id: Date.now(),
    text: data.text,
    completed: false,
  };
  tasks.push(tarea);
  return tarea;
};

/**
 * Elimina una tarea por id.
 * Lanza un error si el id no existe.
 * @param {number} id
 */
const eliminarTarea = (id) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error('NOT_FOUND');
  }
  tasks.splice(index, 1);
};

module.exports = { obtenerTodas, crearTarea, eliminarTarea };