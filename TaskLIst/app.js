const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const searchInput = document.getElementById("search-input");
const taskList = document.getElementById("task-list");

let tasks = [];

document.addEventListener("DOMContentLoaded", () => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks(tasks);
  }
});

form.addEventListener("submit", function(e) {
  e.preventDefault();
  const taskText = input.value.trim();
  if (taskText === "") return;
  addTask(taskText);
  input.value = "";
});

searchInput.addEventListener("input", function() {
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
    li.textContent = task.text;
    li.setAttribute("data-id", task.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
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