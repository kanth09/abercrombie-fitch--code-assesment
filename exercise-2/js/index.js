let toDoTasks = {};
const incompleteTasksContainer = document.getElementById("incomplete-tasks");
const completedTasksContainer = document.getElementById("completed-tasks");
const taskInput = document.getElementById("new-task-input");
const inpError = document.getElementById('inp-error');
const addBtn = document.getElementById('add-task');

function init() {
  const todo = localStorage.getItem("toDoTasks");
  if(todo) {
    toDoTasks = JSON.parse(todo);
    const existingList = Object.keys(toDoTasks);
    for(let i = 0; i < existingList.length; i++) {
      addTaskOnClick(toDoTasks[existingList[i]], existingList[i]);
    }
  }
}

const setLocalStorage = () => {
  localStorage.setItem("toDoTasks", JSON.stringify(toDoTasks));
}

const createTaskElement = function (taskStringObj, id) {
  const listItem = document.createElement("li");
  const checkBox = document.createElement("input");
  const label = document.createElement("label");
  const editInput = document.createElement("input");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  listItem.id = id ? id : new Date().getTime();
  checkBox.type = "checkbox";
  checkBox.tabIndex = 0;
  editInput.type = "text";
  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";
  label.innerText = taskStringObj.name;
  if(taskStringObj.isCompleted) {
    checkBox.checked = true;
  }

  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
};


taskInput.addEventListener('keydown',(event)=>{
  inpError.style.display='none';
  if(event.key === 'Enter'){
    addTask()
  }
})

addBtn.addEventListener('click',() =>{
  addTask();
})


const addTask = () => {
  let listItemName = taskInput.value;
  listItemName = listItemName && listItemName.trim();
  if(listItemName) {
    const listItemNameObj = {"name": listItemName, "isCompleted": false};
    const currentListItem = addTaskOnClick(listItemNameObj);
    toDoTasks[currentListItem["id"]] = listItemNameObj;
    inpError.style.display='none';
    setLocalStorage();
  } else {
    inpError.style.display='block';
  }
    taskInput.value = "";  
}

const addTaskOnClick = function (valueObj, id) {
  const listItem = createTaskElement(valueObj, id);
  const folderToAppend = valueObj.isCompleted ? completedTasksContainer : incompleteTasksContainer;
  folderToAppend.appendChild(listItem);
  const eventToBind = valueObj.isCompleted ? taskIncomplete : taskCompleted;
  taskBindEvnts(listItem, eventToBind);
  return listItem;
};

const editTask = function () {
  const listItem = this.parentNode;
  const editInput = listItem.querySelectorAll("input[type=text")[0];
  const label = listItem.querySelector("label");
  const button = listItem.getElementsByTagName("button")[0];

  const containsClass = listItem.classList.contains("editMode");
  if (containsClass) {
    label.innerText = editInput.value;
    toDoTasks[listItem["id"]]["name"] = editInput.value;
    setLocalStorage();
    button.innerText = "Edit";
  } else {
    editInput.value = label.innerText
    button.innerText = "Save";
  }
  listItem.classList.toggle("editMode");
};

const deleteTask = function (el) {
  const listItem = this.parentNode;
  const ul = listItem.parentNode;
  delete toDoTasks[listItem["id"]];
  setLocalStorage();
  ul.removeChild(listItem);
};

const taskCompleted = function (el) {
  const listItem = this.parentNode;
  completedTasksContainer.appendChild(listItem);
  toDoTasks[listItem["id"]]["isCompleted"] = true;
  setLocalStorage();
  taskBindEvnts(listItem, taskIncomplete);
};

const taskIncomplete = function () {
  const listItem = this.parentNode;
  incompleteTasksContainer.appendChild(listItem);
  toDoTasks[listItem["id"]]["isCompleted"] = false;
  setLocalStorage();
  taskBindEvnts(listItem, taskCompleted);
};

const taskBindEvnts = function (taskListItem, checkBoxEventHandler, cb) {
  const checkBox = taskListItem.querySelectorAll("input[type=checkbox]")[0];
  const editButton = taskListItem.querySelectorAll("button.edit")[0];
  const deleteButton = taskListItem.querySelectorAll("button.delete")[0];
  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
};