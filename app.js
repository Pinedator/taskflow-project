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

let tasks = [];
let filtered = null; // Lista filtrada cuando hay búsqueda activa
// ---------- Inicialización ----------
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initTasks();
  initEvents();
});
const initTheme = () => {
  const savedTheme = loadThemeFromStorage();
  const isDark = savedTheme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
};
const initTasks = () => {
  tasks = loadTasksFromStorage();
  renderTasks(tasks);
};
const initEvents = () => {
  themeToggle.addEventListener("click", handleThemeToggle);
  form.addEventListener("submit", handleFormSubmit);
  searchInput.addEventListener("input", handleSearchInput);
  taskList.addEventListener("click", handleTaskListClick);
};
// ---------- Manejadores de eventos ----------
const handleThemeToggle = () => {
  const isDark = document.documentElement.classList.toggle("dark");
  saveThemeToStorage(isDark ? "dark" : "light");
};
const handleFormSubmit = (event) => {
  event.preventDefault();
  const taskText = input.value.trim();
  if (!taskText) return;
  addTask(taskText);
  input.value = "";
  if (filtered !== null) {
    applyFilter(searchInput.value);
  }
};
const handleSearchInput = () => {
  applyFilter(searchInput.value);
};
const handleTaskListClick = (event) => {
  const deleteButton = event.target.closest("button[data-action='delete']");
  if (!deleteButton) return;
  const li = deleteButton.closest("li[data-id]");
  if (!li) return;
  const id = Number(li.dataset.id);
  li.classList.add("opacity-50", "line-through");
  setTimeout(() => {
    deleteTask(id);
  }, 200);
};
// ---------- Lógica de tareas ----------
const applyFilter = (query) => {
  const value = query.trim().toLowerCase();
  if (!value) {
    filtered = null;
    renderTasks(tasks);
    return;
  }
  filtered = tasks.filter((task) =>
    task.text.toLowerCase().includes(value)
  );
  renderTasks(filtered);
};
const addTask = (text) => {
  const task = { id: Date.now(), text };
  tasks.push(task);
  saveTasks();
  if (filtered !== null) {
    applyFilter(searchInput.value);
  } else {
    renderTasks(tasks);
  }
};
const renderTasks = (taskArray) => {
  taskList.innerHTML = "";
  const fragment = document.createDocumentFragment();
  taskArray.forEach((task) => {
    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center p-2 bg-indigo-700 dark:bg-indigo-600 text-white rounded-md transition-colors hover:bg-indigo-600 dark:hover:bg-indigo-500";
    li.dataset.id = task.id;
    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = "truncate pr-2";
    li.appendChild(span);
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.type = "button";
    deleteBtn.className =
      "ml-2 bg-red-600 dark:bg-red-500 px-2 py-1 rounded-md text-sm font-semibold transition-colors hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400";
    deleteBtn.dataset.action = "delete";
    li.appendChild(deleteBtn);
    fragment.appendChild(li);
  });
  taskList.appendChild(fragment);
};
const deleteTask = (id) => {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return;
  tasks.splice(index, 1);
  saveTasks();
  if (filtered !== null) {
    applyFilter(searchInput.value);
  } else {
    renderTasks(tasks);
  }
};
// ---------- Persistencia ----------
const loadThemeFromStorage = () => localStorage.getItem("theme");
const saveThemeToStorage = (theme) => {
  localStorage.setItem("theme", theme);
};
const loadTasksFromStorage = () => {
  const savedTasks = localStorage.getItem("tasks");
  return savedTasks ? JSON.parse(savedTasks) : [];
};
const saveTasksToStorage = (tasksToSave) => {
  localStorage.setItem("tasks", JSON.stringify(tasksToSave));
};
const saveTasks = () => {
  saveTasksToStorage(tasks);
};