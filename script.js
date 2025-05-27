// Cargar tareas desde localStorage al iniciar
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();

// Elementos del DOM
const taskForm = {
    id: document.getElementById('taskId'),
    title: document.getElementById('title'),
    description: document.getElementById('description'),
    dueDate: document.getElementById('dueDate'),
    addBtn: document.getElementById('addTaskBtn'),
    successMessage: document.getElementById('successMessage'),
    titleError: document.getElementById('titleError'),
    descriptionError: document.getElementById('descriptionError'),
    dueDateError: document.getElementById('dueDateError'),
};

// Manejar el evento de agregar/editar tarea
taskForm.addBtn.addEventListener('click', () => {
    const title = taskForm.title.value.trim();
    const description = taskForm.description.value.trim();
    const dueDate = taskForm.dueDate.value;
    let isValid = true;

    // Validaciones
    taskForm.titleError.classList.add('hidden');
    taskForm.descriptionError.classList.add('hidden');
    taskForm.dueDateError.classList.add('hidden');

    if (!title) {
        taskForm.titleError.textContent = 'El título es obligatorio';
        taskForm.titleError.classList.remove('hidden');
        isValid = false;
    }
    if (!description) {
        taskForm.descriptionError.textContent = 'La descripción es obligatoria';
        taskForm.descriptionError.classList.remove('hidden');
        isValid = false;
    }
    if (!dueDate) {
        taskForm.dueDateError.textContent = 'La fecha de vencimiento es obligatoria';
        taskForm.dueDateError.classList.remove('hidden');
        isValid = false;
    }

    if (!isValid) return;

    if (taskForm.id.value) {
        // Editar tarea existente
        const taskId = parseInt(taskForm.id.value);
        tasks = tasks.map(task => task.id === taskId ? { id: taskId, title, description, dueDate, completed: task.completed } : task);
        taskForm.addBtn.textContent = 'Agregar Tarea';
    } else {
        // Agregar nueva tarea
        const newTask = {
            id: Date.now(),
            title,
            description,
            dueDate,
            completed: false
        };
        tasks.push(newTask);
    }

    // Guardar en localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    resetForm();
    showSuccessMessage();
});

// Renderizar tareas
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="task-header">
                <h3>${task.title}</h3>
                <div class="task-actions">
                    <button class="complete" onclick="toggleComplete(${task.id})">${task.completed ? 'Desmarcar' : 'Completar'}</button>
                    <button class="edit" onclick="editTask(${task.id})">Editar</button>
                    <button class="delete" onclick="deleteTask(${task.id})">Eliminar</button>
                </div>
            </div>
            <div class="task-details">
                <p>${task.description}</p>
                <p>Vence: ${task.dueDate}</p>
            </div>
        `;
        // Agregar evento de clic para expandir/contraer
        li.querySelector('.task-header').addEventListener('click', (e) => {
            // Evitar que los clics en los botones activen la expansión
            if (e.target.tagName === 'BUTTON') return;
            const details = li.querySelector('.task-details');
            details.classList.toggle('visible');
        });
        taskList.appendChild(li);
    });
}

// Marcar/desmarcar tarea como completada
function toggleComplete(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Editar tarea
function editTask(id) {
    const task = tasks.find(task => task.id === id);
    taskForm.id.value = task.id;
    taskForm.title.value = task.title;
    taskForm.description.value = task.description;
    taskForm.dueDate.value = task.dueDate;
    taskForm.addBtn.textContent = 'Guardar Cambios';
}

// Eliminar tarea
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Resetear formulario
function resetForm() {
    taskForm.id.value = '';
    taskForm.title.value = '';
    taskForm.description.value = '';
    taskForm.dueDate.value = '';
    taskForm.addBtn.textContent = 'Agregar Tarea';
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
    taskForm.successMessage.classList.remove('hidden');
    setTimeout(() => taskForm.successMessage.classList.add('hidden'), 2000);
}