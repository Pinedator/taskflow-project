
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

  sortChronoBtn.addEventListener("click", () => setSortOrder("chrono"));
  sortAlphaBtn.addEventListener("click", () => setSortOrder("alpha"));
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
 * Maneja el clic en la lista de tareas para eliminar una tarea.
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
 * Devuelve las tareas visibles según búsqueda + filtro de estado.
 * @returns {Array<{id:number,text:string,completed:boolean}>}
 */
// Ordena el array según el criterio activo
const getSortedTasks = (taskArray) => {
  if (sortOrder === "alpha") {
    return [...taskArray].sort((a, b) =>
      a.text.localeCompare(b.text, "es", { sensitivity: "base" })
    );
  }
  // "chrono": el id es Date.now(), así que orden ascendente = orden de creación
  return [...taskArray].sort((a, b) => a.id - b.id);
};

// Cambia el criterio de orden y actualiza los estilos de los botones
const setSortOrder = (order) => {
  sortOrder = order;
  // Actualiza clases de los botones (activo = fondo oscuro, inactivo = fondo claro)
  sortChronoBtn.className = sortChronoBtn.className.replace(
    order === "chrono"
      ? "bg-indigo-100 text-indigo-800"
      : "bg-indigo-700 text-white",
    order === "chrono"
      ? "bg-indigo-700 text-white"
      : "bg-indigo-100 text-indigo-800"
  );
  sortAlphaBtn.className = sortAlphaBtn.className.replace(
    order === "alpha"
      ? "bg-indigo-100 text-indigo-800"
      : "bg-indigo-700 text-white",
    order === "alpha"
      ? "bg-indigo-700 text-white"
      : "bg-indigo-100 text-indigo-800"
  );
  renderTasks(getVisibleTasks());
};

const getVisibleTasks = () => {
  const query = searchQuery.trim().toLowerCase();

  const filtered = tasks.filter((task) => {
    const matchesText = !query ? true : task.text.toLowerCase().includes(query);
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "completed"
          ? task.completed
          : !task.completed;

    return matchesText && matchesStatus;
  });
   return getSortedTasks(filtered);
};

/**
 * Cambia el filtro de estado y vuelve a renderizar.
 * @param {"all"|"pending"|"completed"} filter
 */
const setStatusFilter = (filter) => {
  statusFilter = filter;
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
 * @param {Array<{id: number, text: string, completed?: boolean}>} taskArray
 */
const renderTasks = (taskArray) => {
  taskList.innerHTML = "";
  const fragment = document.createDocumentFragment();
  taskArray.forEach((task) => {
    const li = document.createElement("li");
    li.className =
      `flex justify-between items-center p-2 rounded-md transition-colors ${task.completed
        ? "bg-indigo-400 dark:bg-indigo-300 hover:bg-indigo-300 dark:hover:bg-indigo-200"
        : "bg-indigo-700 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500"
      } text-white`;
    li.dataset.id = task.id;
    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = "truncate pr-2";
    if (task.completed) {
      span.classList.add("line-through", "opacity-70");
    }
    li.appendChild(span);

    const btnGroup = document.createElement("div");
    btnGroup.className = "flex items-center gap-2 shrink-0"

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.dataset.action = "toggle-completed";
    toggleBtn.textContent = task.completed ? "Pendiente" : "Completar";
    toggleBtn.className =
      `px-2 py-1 rounded-md text-sm font-semibold transition-colors hover:scale-105 focus:outline-none focus:ring-2 ${task.completed
        ? "bg-orange-500 focus:ring-orange-300 text-gray-900 focus:ring-yellow-300"
        : "bg-green-500 dark:bg-green-400 text-white focus:ring-green-300"
      }`;


    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.dataset.action = "edit";
    editBtn.textContent = "Editar";
    editBtn.className =
      " bg-yellow-400 dark:bg-yellow-300 text-gray-900 px-2 py-1 rounded-md text-sm font-semibold transition-colors hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-300";


    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.type = "button";
    deleteBtn.className =
      " bg-red-600 dark:bg-red-500 px-2 py-1 rounded-md text-sm font-semibold transition-colors hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400";
    deleteBtn.dataset.action = "delete";

    btnGroup.appendChild(toggleBtn);
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    li.appendChild(btnGroup);
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
  const parsed = savedTasks ? JSON.parse(savedTasks) : [];
  return Array.isArray(parsed)
    ? parsed.map((t) => ({
      id: t.id,
      text: t.text,
      completed: Boolean(t.completed),
    }))
    : [];
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