const API_URL = 'http://localhost:3000/api/v1/tasks';

export const obtenerTareas = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener las tareas');
  return res.json();
};

export const crearTarea = async (text) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Error al crear la tarea');
  return res.json();
};

export const eliminarTarea = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar la tarea');
};

export const toggleTarea = async (id) => {
  const res = await fetch(`${API_URL}/${id}/toggle`, { method: 'PATCH' });
  if (!res.ok) throw new Error('Error al cambiar el estado');
  return res.json();
};

export const editarTarea = async (id, text) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Error al editar la tarea');
  return res.json();
};