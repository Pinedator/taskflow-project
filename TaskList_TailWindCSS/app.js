const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const searchInput = document.getElementById("search-input");
const taskList = document.getElementById("task-list");
const themeToggle = document.getElementById("theme-toggle");

let tasks = [];

themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
});

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks(tasks);
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const taskText = input.value.trim();
  if (taskText === "") return;
  addTask(taskText);
  input.value = "";
});

searchInput.addEventListener("input", function () {
  const query = searchInput.value.toLowerCase();
  const filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(query)
  );
  renderTasks(filteredTasks);
});

function addTask(text) {
  const task = { id: Date.now(), text };
  tasks.push(task);
  saveTasks();
  renderTasks(tasks);
}

function renderTasks(taskArray) {
  taskList.innerHTML = "";
  taskArray.forEach(task => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center p-2 bg-indigo-700 dark:bg-indigo-600 text-white rounded-md transition-colors hover:bg-indigo-600 dark:hover:bg-indigo-500";
    li.textContent = task.text;
    li.setAttribute("data-id", task.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.className = "ml-2 bg-red-600 dark:bg-red-500 px-2 py-1 rounded-md text-sm font-semibold transition-colors hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks(tasks);
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}