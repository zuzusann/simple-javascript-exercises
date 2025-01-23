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


formEl.addEventListener("submit", async (event) => {
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
});


function toDoList(task) {
  const liEl = document.createElement("li");
  if (task.checked) {
    liEl.classList.add("checked");
  }
  liEl.innerText = task.title;

  const checkBtnEl = document.createElement("div");
  checkBtnEl.innerHTML = `<i class="fas fa-check-square"></i>`;
  liEl.appendChild(checkBtnEl);

  const trashBtnEl = document.createElement("div");
  trashBtnEl.innerHTML = `<i class="fas fa-trash"></i>`;
  liEl.appendChild(trashBtnEl);

  ulEl.appendChild(liEl);


  checkBtnEl.addEventListener("click", async () => {
    task.checked = !task.checked;
    console.log(task.checked);
    liEl.classList.toggle("checked");

  
    await fetch(`${API_URL}/${task.id}`, {
      method: "PUT",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
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
