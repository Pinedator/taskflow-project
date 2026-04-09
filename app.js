import { obtenerTareas, crearTarea, eliminarTarea, toggleTarea, editarTarea } from './api/client.js';

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const searchInput = document.getElementById("search-input");
const taskList = document.getElementById("task-list");
const themeToggle = document.getElementById("theme-toggle");

const filterAllBtn = document.getElementById("filter-all");
const filterPendingBtn = document.getElementById("filter-pending");
const filterCompletedBtn = document.getElementById("filter-completed");
const completeAllBtn = document.getElementById("complete-all");
const clearCompletedBtn = document.getElementById("clear-completed");
const sortChronoBtn = document.getElementById("sort-chrono");
const sortAlphaBtn = document.getElementById("sort-alpha");

let tasks = [];
let sortOrder = "chrono";
let searchQuery = "";
let statusFilter = "all";

// ---------- Estados de red ----------

const showLoading = () => {
  taskList.innerHTML = `
    <li class="text-center text-indigo-300 py-8 animate-pulse">
      Cargando tareas...
    </li>`;
};

const showError = (message) => {
  taskList.innerHTML = `
    <li class="text-center text-red-400 py-8">
      ⚠️ ${message}
    </li>`;
};

// ---------- Inicialización ----------

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initEvents();
  cargarTareas();
});

const initTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  document.documentElement.classList.toggle("dark", savedTheme === "dark");
};

const initEvents = () => {
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
  form.addEventListener("submit", handleFormSubmit);
  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    renderTasks(getVisibleTasks());
  });
  taskList.addEventListener("click", handleTaskListClick);
  filterAllBtn.addEventListener("click", () => setStatusFilter("all"));
  filterPendingBtn.addEventListener("click", () => setStatusFilter("pending"));
  filterCompletedBtn.addEventListener("click", () => setStatusFilter("completed"));
  completeAllBtn.addEventListener("click", handleCompleteAll);
  clearCompletedBtn.addEventListener("click", handleClearCompleted);
  sortChronoBtn.addEventListener("click", () => setSortOrder("chrono"));
  sortAlphaBtn.addEventListener("click", () => setSortOrder("alpha"));
};

// ---------- Llamadas al servidor ----------

const cargarTareas = async () => {
  showLoading();
  try {
    tasks = await obtenerTareas();
    renderTasks(getVisibleTasks());
  } catch (error) {
    showError('No se pudo conectar con el servidor. ¿Está arrancado?');
  }
};

const handleFormSubmit = async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  try {
    const tarea = await crearTarea(text);
    tasks.push(tarea);
    input.value = "";
    renderTasks(getVisibleTasks());
  } catch (error) {
    showError('No se pudo crear la tarea.');
  }
};

const handleTaskListClick = async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const li = button.closest("li[data-id]");
  if (!li) return;
  const id = Number(li.dataset.id);
  const action = button.dataset.action;

  if (action === "delete") {
    li.classList.add("opacity-50");
    try {
      await eliminarTarea(id);
      tasks = tasks.filter((t) => t.id !== id);
      renderTasks(getVisibleTasks());
    } catch (error) {
      li.classList.remove("opacity-50");
      showError('No se pudo eliminar la tarea.');
    }
  }

  if (action === "toggle-completed") {
    try {
      const tareaActualizada = await toggleTarea(id);
      const index = tasks.findIndex((t) => t.id === id);
      tasks[index] = tareaActualizada;
      renderTasks(getVisibleTasks());
    } catch (error) {
      showError('No se pudo cambiar el estado de la tarea.');
    }
  }

  if (action === "edit") {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newText = prompt("Editar tarea:", task.text);
    if (newText === null) return;
    const trimmed = newText.trim();
    if (!trimmed) return;
    try {
      const tareaActualizada = await editarTarea(id, trimmed);
      const index = tasks.findIndex((t) => t.id === id);
      tasks[index] = tareaActualizada;
      renderTasks(getVisibleTasks());
    } catch (error) {
      showError('No se pudo editar la tarea.');
    }
  }
};

const handleCompleteAll = async () => {
  try {
    const pendientes = tasks.filter((t) => !t.completed);
    for (const task of pendientes) {
      const tareaActualizada = await toggleTarea(task.id);
      const index = tasks.findIndex((t) => t.id === task.id);
      tasks[index] = tareaActualizada;
    }
    renderTasks(getVisibleTasks());
  } catch (error) {
    showError('No se pudieron completar todas las tareas.');
  }
};

const handleClearCompleted = async () => {
  try {
    const completadas = tasks.filter((t) => t.completed);
    for (const task of completadas) {
      await eliminarTarea(task.id);
    }
    tasks = tasks.filter((t) => !t.completed);
    renderTasks(getVisibleTasks());
  } catch (error) {
    showError('No se pudieron borrar las tareas completadas.');
  }
};

// ---------- Lógica de visibilidad y orden ----------

const getSortedTasks = (taskArray) => {
  if (sortOrder === "alpha") {
    return [...taskArray].sort((a, b) =>
      a.text.localeCompare(b.text, "es", { sensitivity: "base" })
    );
  }
  return [...taskArray].sort((a, b) => a.id - b.id);
};

const getVisibleTasks = () => {
  const query = searchQuery.trim().toLowerCase();
  const filtered = tasks.filter((task) => {
    const matchesText = !query ? true : task.text.toLowerCase().includes(query);
    const matchesStatus =
      statusFilter === "all" ? true
      : statusFilter === "completed" ? task.completed
      : !task.completed;
    return matchesText && matchesStatus;
  });
  return getSortedTasks(filtered);
};

const setStatusFilter = (filter) => {
  statusFilter = filter;
  renderTasks(getVisibleTasks());
};

const setSortOrder = (order) => {
  sortOrder = order;
  sortChronoBtn.className = sortChronoBtn.className.replace(
    order === "chrono" ? "bg-indigo-100 text-indigo-800" : "bg-indigo-700 text-white",
    order === "chrono" ? "bg-indigo-700 text-white" : "bg-indigo-100 text-indigo-800"
  );
  sortAlphaBtn.className = sortAlphaBtn.className.replace(
    order === "alpha" ? "bg-indigo-100 text-indigo-800" : "bg-indigo-700 text-white",
    order === "alpha" ? "bg-indigo-700 text-white" : "bg-indigo-100 text-indigo-800"
  );
  renderTasks(getVisibleTasks());
};

// ---------- Render ----------

const renderTasks = (taskArray) => {
  taskList.innerHTML = "";
  if (taskArray.length === 0) {
    taskList.innerHTML = `<li class="text-center text-indigo-300 py-8">No hay tareas</li>`;
    return;
  }
  const fragment = document.createDocumentFragment();
  taskArray.forEach((task) => {
    const li = document.createElement("li");
    li.className = `flex justify-between items-center p-2 rounded-md transition-colors ${
      task.completed
        ? "bg-indigo-400 dark:bg-indigo-300 hover:bg-indigo-300 dark:hover:bg-indigo-200"
        : "bg-indigo-700 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500"
    } text-white`;
    li.dataset.id = task.id;

    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = "truncate pr-2";
    if (task.completed) span.classList.add("line-through", "opacity-70");
    li.appendChild(span);

    const btnGroup = document.createElement("div");
    btnGroup.className = "flex items-center gap-2 shrink-0";

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.dataset.action = "toggle-completed";
    toggleBtn.textContent = task.completed ? "Pendiente" : "Completar";
    toggleBtn.className = `px-2 py-1 rounded-md text-sm font-semibold transition-colors hover:scale-105 focus:outline-none focus:ring-2 ${
      task.completed
        ? "bg-orange-500 text-gray-900 focus:ring-orange-300"
        : "bg-green-500 dark:bg-green-400 text-white focus:ring-green-300"
    }`;

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.dataset.action = "edit";
    editBtn.textContent = "Editar";
    editBtn.className = "bg-yellow-400 dark:bg-yellow-300 text-gray-900 px-2 py-1 rounded-md text-sm font-semibold transition-colors hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-300";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.dataset.action = "delete";
    deleteBtn.textContent = "Eliminar";
    deleteBtn.className = "bg-red-600 dark:bg-red-500 px-2 py-1 rounded-md text-sm font-semibold transition-colors hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400";

    btnGroup.appendChild(toggleBtn);
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);
    li.appendChild(btnGroup);
    fragment.appendChild(li);
  });
  taskList.appendChild(fragment);
};