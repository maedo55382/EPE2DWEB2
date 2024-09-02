document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskTableBody = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
    const generateReportButton = document.getElementById('generateReport');
    const taskChart = document.getElementById('taskChart').getContext('2d');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let taskId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

    // Cargar tareas en la tabla
    tasks.forEach(task => addTaskToTable(task));

    // Manejo del formulario de tarea
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const taskName = document.getElementById('taskName').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const assignee = document.getElementById('assignee').value;

        const task = {
            id: taskId++,
            name: taskName,
            startDate: startDate,
            endDate: endDate,
            assignee: assignee,
            status: 'Pendiente'
        };

        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        addTaskToTable(task);
        taskForm.reset();
    });

    // Agregar tarea a la tabla
    function addTaskToTable(task) {
        const row = taskTableBody.insertRow();
        row.setAttribute('data-id', task.id);
        row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.name}</td>
            <td>${task.startDate}</td>
            <td>${task.endDate}</td>
            <td>${task.assignee}</td>
            <td>${task.status}</td>
            <td>
                <button onclick="markAsComplete(${task.id})">Completar</button>
                <button onclick="deleteTask(${task.id})">Eliminar</button>
            </td>
        `;
    }

    // Marcar tarea como completada
    window.markAsComplete = function(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.status = 'Completada';
            localStorage.setItem('tasks', JSON.stringify(tasks));
            updateTaskInTable(id);
        }
    };

    // Eliminar tarea
    window.deleteTask = function(id) {
        tasks = tasks.filter(t => t.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        const row = [...taskTableBody.rows].find(row => row.getAttribute('data-id') == id);
        if (row) row.remove();
    };

    // Actualizar tarea en la tabla
    function updateTaskInTable(id) {
        const row = [...taskTableBody.rows].find(row => row.getAttribute('data-id') == id);
        if (row) {
            row.cells[5].textContent = 'Completada';
        }
    }

    // Generar reporte
    generateReportButton.addEventListener('click', () => {
        const statusCounts = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(statusCounts);
        const data = Object.values(statusCounts);

        new Chart(taskChart, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Contador de Estado de Tareas',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
});
