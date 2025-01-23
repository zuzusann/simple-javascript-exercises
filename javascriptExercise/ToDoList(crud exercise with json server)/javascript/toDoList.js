const formEl = document.querySelector(".form");
const inputEl = document.querySelector(".input");
const ulEl = document.querySelector(".list");
const API_URL = "http://localhost:3000/tasks"; 

const renderTasks = async () => {
  const res = await fetch(API_URL);
  const tasks = await res.json();

  ulEl.innerHTML = "";
  tasks.forEach((task) => {
    toDoList(task);
  });
};

// Handle form submission
const handleSubmit = async (event) => {
  event.preventDefault();

  const title = inputEl.value.trim();
  if (!title) {
    alert("Task title cannot be empty!");
    return;
  }

  const newTask = { title, checked: false };

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(newTask),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const createdTask = await res.json();
  toDoList(createdTask);
  inputEl.value = ""; 
};

formEl.addEventListener("submit", handleSubmit);

// Handle Enter key in main input
inputEl.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleSubmit(e);
  }
});

function toDoList(task) {
  const liEl = document.createElement("li");
  if (task.checked) {
    liEl.classList.add("checked");
  }

  // Create checkbox first
  const checkBtnEl = document.createElement("div");
  checkBtnEl.classList.add("checkbox");
  checkBtnEl.innerHTML = task.checked ? 
    `<i class="fas fa-check-circle"></i>` : 
    `<i class="far fa-circle"></i>`;
  liEl.appendChild(checkBtnEl);

  // Add task text
  const taskText = document.createElement("span");
  taskText.innerText = task.title;
  liEl.appendChild(taskText);

  // Add edit button
  const editBtnEl = document.createElement("div");
  editBtnEl.innerHTML = `<i class="fas fa-edit"></i>`;
  liEl.appendChild(editBtnEl);

  // Add delete button last
  const trashBtnEl = document.createElement("div");
  trashBtnEl.innerHTML = `<i class="fas fa-trash"></i>`;
  liEl.appendChild(trashBtnEl);

  ulEl.appendChild(liEl);

  checkBtnEl.addEventListener("click", async () => {
    task.checked = !task.checked;
    liEl.classList.toggle("checked");
    // Update checkbox icon
    checkBtnEl.innerHTML = task.checked ? 
      `<i class="fas fa-check-circle"></i>` : 
      `<i class="far fa-circle"></i>`;

    await fetch(`${API_URL}/${task.id}`, {
      method: "PUT",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  editBtnEl.addEventListener("click", () => {
    // Create edit mode elements
    const editingDiv = document.createElement("div");
    editingDiv.className = "editing";
    
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = task.title;
    
    const saveBtn = document.createElement("button");
    saveBtn.className = "save-btn";
    saveBtn.innerHTML = `<i class="fas fa-check"></i>`;
    
    editingDiv.appendChild(editInput);
    editingDiv.appendChild(saveBtn);
    
    // Replace task text with editing elements
    taskText.style.display = "none";
    liEl.insertBefore(editingDiv, editBtnEl);
    
    // Focus the input
    editInput.focus();
    
    // Save functionality
    const saveEdit = async () => {
      const newTitle = editInput.value.trim();
      if (newTitle && newTitle !== task.title) {
        task.title = newTitle;
        await fetch(`${API_URL}/${task.id}`, {
          method: "PUT",
          body: JSON.stringify(task),
          headers: {
            "Content-Type": "application/json",
          },
        });
        taskText.innerText = newTitle;
      }
      // Clean up edit mode
      editingDiv.remove();
      taskText.style.display = "";
    };
    
    saveBtn.addEventListener("click", saveEdit);
    
    // Handle Enter and Escape keys in edit mode
    editInput.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        await saveEdit();
      }
    });

    editInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        editingDiv.remove();
        taskText.style.display = "";
      }
    });
  });

  trashBtnEl.addEventListener("click", async () => {
    liEl.remove();

    await fetch(`${API_URL}/${task.id}`, {
      method: "DELETE",
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
});