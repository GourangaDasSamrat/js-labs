function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function renderIncomplete(todoTitle) {
  const li = document.createElement("li");
  li.className = "item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("click", () => completeTask(todoTitle));

  const label = document.createElement("label");
  label.textContent = todoTitle;

  li.append(checkbox, label);
  return li;
}

function renderComplete(todoTitle) {
  const li = document.createElement("li");
  li.className = "item";

  const titleSpan = document.createElement("span");
  titleSpan.textContent = todoTitle;

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.className = "delete";
  delBtn.onclick = () => deleteTask(todoTitle);

  li.append(titleSpan, delBtn);
  return li;
}

let incompleteTasks = loadData("incompleteTasks");
let completeTasks = loadData("completeTasks");

function refreshUI() {
  const incList = document.querySelector("#items");
  const compList = document.querySelector(".complete-list ul");

  incList.innerHTML = "";
  compList.innerHTML = "";

  incompleteTasks.forEach((title) =>
    incList.appendChild(renderIncomplete(title))
  );
  completeTasks.forEach((title) => compList.appendChild(renderComplete(title)));
}

function addTask(title) {
  incompleteTasks.push(title);
  saveData("incompleteTasks", incompleteTasks);
  refreshUI();
}

function completeTask(title) {
  incompleteTasks = incompleteTasks.filter((t) => t !== title);
  completeTasks.push(title);

  saveData("incompleteTasks", incompleteTasks);
  saveData("completeTasks", completeTasks);

  refreshUI();
}

function deleteTask(title) {
  completeTasks = completeTasks.filter((t) => t !== title);

  saveData("completeTasks", completeTasks);
  refreshUI();
}

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();

  const input = document.getElementById("new-task");
  const title = input.value.trim();
  if (!title) return;

  addTask(title);
  e.target.reset();
});

refreshUI();
