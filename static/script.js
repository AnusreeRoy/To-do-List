const taskInput = document.getElementById("task-input");
const TaskBtn = document.getElementById("task-butt");
const TaskList = document.getElementById("task-list");
const taskDate = document.getElementById("task-date");
//add and display task
document.addEventListener("DOMContentLoaded", load_tasks);

//Add task
TaskBtn.addEventListener("click", ()=>{
    const task = taskInput.value.trim();
    const dateTime = taskDate.value;
    if (task==="" || dateTime==="") return;

    fetch("http://127.0.0.1:5000/tasks", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify({task:task, dateTime:dateTime})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        taskInput.value ="";
        taskDate.value = "";
        load_tasks();
    })
    .catch(error => console.error("Error:", error))
})

TaskBtn.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        add_task(task);
    }
})
//Load tasks 
function load_tasks(){
    fetch("http://127.0.0.1:5000/tasks")
    .then(response=> response.json() )
    .then(tasks => {
        if (!Array.isArray(tasks)) tasks = [];
        TaskList.innerHTML ="";
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.className= "text-sm text-white p-1" 
            // li.innerHTML = `${task}<button onclick="delete_task(${index})">Delete</button>`;
            // TaskList.appendChild(li);

            const span = document.createElement("span");
            span.innerText = `${task.task}(${task.dateTime})`;
            span.setAttribute("id", `task-text-${index}`);

            const editButt = document.createElement("button");
            editButt.className = "btn btn-light btn-sm rounded-2 border border-primary shadow-lg"
            editButt.innerText = "Edit";
            editButt.onclick = () => edit_task(index, task.task, task.dateTime);
            
            const deleteButt = document.createElement("button");
            deleteButt.className = "btn btn-light btn-sm rounded-2 border border-primary shadow-lg"
            deleteButt.innerText = "Delete";
            deleteButt.onclick = () => delete_task(index);

            li.appendChild(span);
            li.appendChild(editButt);
            li.appendChild(deleteButt);
            TaskList.appendChild(li);

        });
    })
    .catch(error => console.error("Error:", error));
}

function delete_task(task_id){
fetch(`http://127.0.0.1:5000/tasks/${task_id}`,
    {method: "DELETE"})
.then(response => response.json())
.then(data => {
    console.log(data);
    load_tasks();
})
.catch(error => console.error("Error", error))
}

function edit_task(task_id, oldtask, oldDateTime){
    const taskText = document.getElementById(`task-text-${task_id}`);
    
    const container = document.createElement("span");
    container.setAttribute("id", `edit-container-${task_id}`);

    const input = document.createElement("input");
    input.className = "form-control form-control-sm w-75 h -25"
    input.type = "text";
    input.value = oldtask;
    input.setAttribute("id", `edit-input-${task_id}`);

    const dateTimeInput = document.createElement("input")
    dateTimeInput.className = "form-control form-control-sm w-75 h-25"
    dateTimeInput.type = "datetime-local";
    dateTimeInput.value = oldDateTime;
    dateTimeInput.setAttribute("id", `edit-date-${task_id}`);

    const saveButt = document.createElement("button");
    saveButt.className = "btn btn-light btn-sm rounded-2 border border-primary shadow-lg";
    saveButt.innerText = "Save";
    saveButt.onclick = () => update_task(task_id, input.value, dateTimeInput.value);

const cancelButt = document.createElement("button");
cancelButt.className = "btn btn-light btn-sm rounded-2 border border-primary shadow-lg";
cancelButt.innerText = "Cancel";
cancelButt.onclick = () => cancel_edit(task_id, oldtask, oldDateTime);

container.appendChild(input);
container.appendChild(dateTimeInput);
container.appendChild(saveButt);
container.appendChild(cancelButt);

    taskText.replaceWith(container);
    input.focus;

    input.addEventListener("keypress", function(event){
        if (event.key === "Enter"){
            update_task(task_id, input.value, dateTimeInput.value);
        }
    });
}

function update_task(task_id, newtask, newDateTime){
fetch(`http://127.0.0.1:5000/tasks/${task_id}`,{
method: "PUT",
headers:{"Content-Type":"application/json"},
body: JSON.stringify({task: newtask, dateTime:newDateTime})
})
.then(response => response.json())
.then(data =>{
    console.log(data);
    load_tasks();
})
.catch(error => console.error("Error", error));
}

function cancel_edit(task_id, oldtask, oldDateTime){
    const editContainer = document.getElementById(`edit-container-${task_id}`);
    const span = document.createElement("span");
    span.innerText = `${oldtask} - ${oldDateTime}`;
    span.setAttribute("id", `task-text-${task_id}`);
    editContainer.replaceWith(span);
}
