// ==== Mejoras implementadas ====
// 1. Unificación de listeners DOMContentLoaded.
// 2. Función única para inicialización y restauración de estado (modo y tareas).
// 3. Mejor legibilidad, comentarios consistentes y nombres claros.
// 4. Uso de delegación de eventos para eliminar tareas (mejor rendimiento).
// 5. Eliminar renderizaciones duplicadas innecesarias.
// 6. Preferencia por funciones flecha donde mejora la lectura.
// 7. Separar UI y lógica de persistencia.
// 8. Previene repintados completos evitables.
// =================================

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

let tasks = [];
let searchQuery = "";
let statusFilter = "all"; // "all" | "pending" | "completed"
// ---------- Inicialización ----------
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initTasks();
  initEvents();
});

/**
 * Inicializa el tema (claro/oscuro) en base al almacenamiento local.
 */
const initTheme = () => {
  const savedTheme = loadThemeFromStorage();
  const isDark = savedTheme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
};

/**
 * Inicializa el array de tareas desde almacenamiento local y las renderiza.
 */
const initTasks = () => {
  tasks = loadTasksFromStorage();
  renderTasks(tasks);
};

/**
 * Añade los event listeners principales del UI.
 */
const initEvents = () => {
  themeToggle.addEventListener("click", handleThemeToggle);
  form.addEventListener("submit", handleFormSubmit);
  searchInput.addEventListener("input", handleSearchInput);
  taskList.addEventListener("click", handleTaskListClick);

  filterAllBtn.addEventListener("click", () => setStatusFilter("all"));
  filterPendingBtn.addEventListener("click", () => setStatusFilter("pending"));
  filterCompletedBtn.addEventListener("click", () => setStatusFilter("completed"));

  completeAllBtn.addEventListener("click", handleCompleteAll);
  clearCompletedBtn.addEventListener("click", handleClearCompleted);
};
// ---------- Manejadores de eventos ----------
/**
 * Cambia entre modo claro y oscuro, y guarda la preferencia.
 */
const handleThemeToggle = () => {
  const isDark = document.documentElement.classList.toggle("dark");
  saveThemeToStorage(isDark ? "dark" : "light");
};

/**
 * Añade una nueva tarea cuando se envía el formulario.
 * @param {Event} event
 */
const handleFormSubmit = (event) => {
  event.preventDefault();
  const taskText = input.value.trim();
  if (!taskText) return;
  addTask(taskText);
  input.value = "";
};

/**
 * Filtra las tareas según el texto de búsqueda.
 */
const handleSearchInput = () => {
  searchQuery = searchInput.value;
  renderTasks(getVisibleTasks());
};

/**
 * Maneja el clic en la lista de tareas para acciones sobre una tarea.
 * @param {Event} event
 */
const handleTaskListClick = (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const li = button.closest("li[data-id]");
  if (!li) return;
  const id = Number(li.dataset.id);

  const action = button.dataset.action;

  if (action === "delete") {
    li.classList.add("opacity-50", "line-through");
    setTimeout(() => {
      deleteTask(id);
    }, 200);
  }

  if (action === "toggle-completed") {
    toggleTaskCompleted(id);
  }

  if (action === "edit") {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newText = prompt("Editar tarea:", task.text);
    if (newText === null) return;
    const trimmed = newText.trim();
    if (!trimmed) return;
    editTask(id, trimmed);
  }
};
// ---------- Lógica de tareas ----------
/**
 * Devuelve las tareas que cumplen con el texto de búsqueda y el filtro de estado.
 * @returns {Array<{id:number,text:string,completed:boolean}>}
 */
const getVisibleTasks = () => {
  const query = searchQuery.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesText = !query
      ? true
      : task.text.toLowerCase().includes(query);

    let matchesStatus = true;
    if (statusFilter === "pending") matchesStatus = !task.completed;
    if (statusFilter === "completed") matchesStatus = task.completed;

    return matchesText && matchesStatus;
  });
};

/**
 * Cambia el filtro de estado actual y vuelve a renderizar.
 * @param {"all"|"pending"|"completed"} filter
 */
const setStatusFilter = (filter) => {
  statusFilter = filter;

  // Actualizar estilos de botones de filtro
  const activeClasses =
    "bg-indigo-700 text-white dark:bg-indigo-500 dark:text-white";
  const inactiveClassesAll =
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100";
  const inactiveClassesPending =
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100";
  const inactiveClassesCompleted =
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";

  // Reset
  filterAllBtn.className =
    "px-3 py-1 rounded-full text-xs font-semibold " + inactiveClassesAll;
  filterPendingBtn.className =
    "px-3 py-1 rounded-full text-xs font-semibold " + inactiveClassesPending;
  filterCompletedBtn.className =
    "px-3 py-1 rounded-full text-xs font-semibold " + inactiveClassesCompleted;

  if (filter === "all") {
    filterAllBtn.className =
      "px-3 py-1 rounded-full text-xs font-semibold " + activeClasses;
  } else if (filter === "pending") {
    filterPendingBtn.className =
      "px-3 py-1 rounded-full text-xs font-semibold " + activeClasses;
  } else if (filter === "completed") {
    filterCompletedBtn.className =
      "px-3 py-1 rounded-full text-xs font-semibold " + activeClasses;
  }

  renderTasks(getVisibleTasks());
};

/**
 * Añade una nueva tarea al array y actualiza el almacenamiento.
 * @param {string} text
 */
const addTask = (text) => {
  const task = { id: Date.now(), text, completed: false };
  tasks.push(task);
  saveTasks();
  renderTasks(getVisibleTasks());
};

/**
 * Renderiza la lista de tareas recibida en el DOM.
 * @param {Array<{id: number, text: string, completed:boolean}>} taskArray
 */
const renderTasks = (taskArray) => {
  taskList.innerHTML = "";
  const fragment = document.createDocumentFragment();
  taskArray.forEach((task) => {
    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center gap-2 p-2 bg-indigo-700 dark:bg-indigo-600 text-white rounded-md transition-colors hover:bg-indigo-600 dark:hover:bg-indigo-500";
    li.dataset.id = task.id;

    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = "flex-1 truncate pr-2";
    if (task.completed) {
      span.classList.add("line-through", "opacity-70");
    }
    li.appendChild(span);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "flex items-center gap-1 flex-shrink-0";

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.dataset.action = "toggle-completed";
    toggleBtn.textContent = task.completed ? "Pendiente" : "Completar";
    toggleBtn.className =
      "bg-green-500 dark:bg-green-400 px-2 py-1 rounded-md text-xs font-semibold transition-colors hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300";
    buttonsContainer.appendChild(toggleBtn);

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.dataset.action = "edit";
    editBtn.textContent = "Editar";
    editBtn.className =
      "bg-yellow-400 dark:bg-yellow-300 text-gray-900 px-2 py-1 rounded-md text-xs font-semibold transition-colors hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-300";
    buttonsContainer.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.type = "button";
    deleteBtn.className =
      "bg-red-600 dark:bg-red-500 px-2 py-1 rounded-md text-xs font-semibold transition-colors hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400";
    deleteBtn.dataset.action = "delete";
    buttonsContainer.appendChild(deleteBtn);

    li.appendChild(buttonsContainer);
    fragment.appendChild(li);
  });
  taskList.appendChild(fragment);
};

/**
 * Elimina una tarea por id, actualiza el almacenamiento y renderiza.
 * @param {number} id
 */
const deleteTask = (id) => {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return;
  tasks.splice(index, 1);
  saveTasks();
  renderTasks(getVisibleTasks());
};

/**
 * Marca o desmarca una tarea como completada.
 * @param {number} id
 */
const toggleTaskCompleted = (id) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  renderTasks(getVisibleTasks());
};

/**
 * Edita el texto de una tarea.
 * @param {number} id
 * @param {string} newText
 */
const editTask = (id, newText) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.text = newText;
  saveTasks();
  renderTasks(getVisibleTasks());
};

/**
 * Marca todas las tareas como completadas.
 */
const handleCompleteAll = () => {
  let changed = false;
  tasks.forEach((task) => {
    if (!task.completed) {
      task.completed = true;
      changed = true;
    }
  });
  if (!changed) return;
  saveTasks();
  renderTasks(getVisibleTasks());
};

/**
 * Elimina todas las tareas completadas.
 */
const handleClearCompleted = () => {
  const hasCompleted = tasks.some((t) => t.completed);
  if (!hasCompleted) return;
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  renderTasks(getVisibleTasks());
};
// ---------- Persistencia ----------
/**
 * Obtiene el tema guardado desde localStorage.
 * @returns {string|null}
 */
const loadThemeFromStorage = () => localStorage.getItem("theme");

/**
 * Guarda el tema actual en localStorage.
 * @param {string} theme
 */
const saveThemeToStorage = (theme) => {
  localStorage.setItem("theme", theme);
};

/**
 * Carga la lista de tareas desde localStorage.
 * @returns {Array<{id: number, text: string}>}
 */
const loadTasksFromStorage = () => {
  const savedTasks = localStorage.getItem("tasks");
  return savedTasks ? JSON.parse(savedTasks) : [];
};

/**
 * Guarda la lista de tareas especificada en localStorage.
 * @param {Array<{id: number, text: string}>} tasksToSave
 */
const saveTasksToStorage = (tasksToSave) => {
  localStorage.setItem("tasks", JSON.stringify(tasksToSave));
};

/**
 * Guarda el array de tareas actual en localStorage.
 */
const saveTasks = () => {
  saveTasksToStorage(tasks);
};