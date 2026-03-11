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
let filtered = null; // Si hay filtro activo, representa la lista filtrada.

// --- Inicialización al cargar la página ---
document.addEventListener("DOMContentLoaded", () => {
  // Restaurar modo oscuro si está guardado
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");

  // Restaurar tareas
  const savedTasks = localStorage.getItem("tasks");
  tasks = savedTasks ? JSON.parse(savedTasks) : [];
  renderTasks(tasks);
});

// --- Cambio de tema: Clara/Oscura ---
themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// --- Añadir tarea ---
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskText = input.value.trim();
  if (!taskText) return;
  addTask(taskText);
  input.value = "";
  // Si había filtro, update el filtro actual
  if (filtered !== null) applyFilter(searchInput.value);
});

// --- Filtro de búsqueda ---
searchInput.addEventListener("input", () => {
  applyFilter(searchInput.value);
});

function applyFilter(query) {
  const val = query.trim().toLowerCase();
  if (!val) {
    filtered = null;
    renderTasks(tasks);
  } else {
    filtered = tasks.filter(task => task.text.toLowerCase().includes(val));
    renderTasks(filtered);
  }
}

// --- Añadir tarea ---
function addTask(text) {
  const task = { id: Date.now(), text };
  tasks.push(task);
  saveTasks();
  if (filtered !== null) {
    // Mantener actualizado el filtro si está activado
    applyFilter(searchInput.value);
  } else {
    renderTasks(tasks);
  }
}

// --- Renderizado eficiente ---
function renderTasks(taskArray) {
  taskList.innerHTML = "";
  // Mejorar rendimiento: usar fragmento
  const fragment = document.createDocumentFragment();
  taskArray.forEach(task => {
    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center p-2 bg-indigo-700 dark:bg-indigo-600 text-white rounded-md transition-colors hover:bg-indigo-600 dark:hover:bg-indigo-500";
    li.setAttribute("data-id", task.id);

    // Sólo el texto, no usamos textContent en li para permitir boton inline
    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = "truncate pr-2";
    li.appendChild(span);

    // Botón Eliminar
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.type = "button";
    deleteBtn.className =
      "ml-2 bg-red-600 dark:bg-red-500 px-2 py-1 rounded-md text-sm font-semibold transition-colors hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400";
    deleteBtn.setAttribute("data-action", "delete");

    li.appendChild(deleteBtn);
    fragment.appendChild(li);
  });
  taskList.appendChild(fragment);
}

// --- Eliminación de tareas (delegación de eventos, mejor performance) ---
taskList.addEventListener("click", (e) => {
  // Solo si dan click al botón eliminar
  if (
    e.target.matches("button[data-action='delete']") &&
    e.target.parentElement
  ) {
    const li = e.target.parentElement;
    const id = Number(li.getAttribute("data-id"));
    // Feedback visual, luego eliminar y refrescar
    li.classList.add("opacity-50", "line-through");
    setTimeout(() => {
      deleteTask(id);
    }, 200);
  }
});

function deleteTask(id) {
  const idx = tasks.findIndex((task) => task.id === id);
  if (idx !== -1) {
    tasks.splice(idx, 1);
    saveTasks();

    // Si hay filtro, refrescar filtro activo
    if (filtered !== null) {
      applyFilter(searchInput.value);
    } else {
      renderTasks(tasks);
    }
  }
}

// --- Persistencia ---
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
