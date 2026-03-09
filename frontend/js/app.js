// app.js - Main Application Logic for Task Prioritization Dashboard

// API Configuration
// Replace with the URL where your Spring Boot backend is running
const API_BASE_URL = 'http://localhost:8080/api/tasks';

// DOM Elements
const taskListEl = document.getElementById('task-list');
const loadingSpinner = document.getElementById('loading-spinner');
const emptyState = document.getElementById('empty-state');
const errorMsg = document.getElementById('error-message');
const userEmailEl = document.getElementById('user-email');
const logoutBtn = document.getElementById('logout-btn');

// Modal Elements
const modal = document.getElementById('task-modal');
const addTaskBtn = document.getElementById('add-task-btn');
const closeModalBtn = document.getElementById('close-modal');
const taskForm = document.getElementById('task-form');
const modalTitle = document.getElementById('modal-title');

// Form Inputs
const inputId = document.getElementById('task-id');
const inputName = document.getElementById('task-name');
const inputDeadline = document.getElementById('deadline');
const inputUrgency = document.getElementById('urgency');
const inputImportance = document.getElementById('importance');
const inputEffort = document.getElementById('effort');

let currentUser = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verify Authentication
    const { data: { session }, error } = await window.supabaseClient.auth.getSession();
    
    if (!session) {
        // Not logged in, redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = session.user;
    
    if(userEmailEl) {
        userEmailEl.textContent = currentUser.email;
    }

    // 2. Load Tasks
    fetchTasks();

    // 3. Setup Event Listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await window.supabaseClient.auth.signOut();
            window.location.href = 'index.html';
        });
    }

    // Modal behavior
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            resetForm();
            modalTitle.textContent = "Add New Task";
            modal.classList.add('active');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Form Submission
    if (taskForm) {
        taskForm.addEventListener('submit', handleTaskSubmit);
    }
}

function resetForm() {
    taskForm.reset();
    inputId.value = '';
    // Set default values back
    inputUrgency.value = 3;
    inputImportance.value = 3;
    inputEffort.value = 3;
}

// Format date for the input field (yyyy-MM-ddThh:mm)
function formatToDatetimeLocal(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16);
}

// --- API Calls ---

async function fetchTasks() {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}?userId=${currentUser.id}`);
        
        if (!response.ok) throw new Error('Failed to fetch tasks');
        
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (err) {
        showError(err.message);
    } finally {
        showLoading(false);
    }
}

async function handleTaskSubmit(e) {
    e.preventDefault();
    
    const taskData = {
        taskName: inputName.value,
        deadline: inputDeadline.value ? new Date(inputDeadline.value).toISOString() : null,
        urgency: parseInt(inputUrgency.value),
        importance: parseInt(inputImportance.value),
        effort: parseInt(inputEffort.value),
        userId: currentUser.id
    };

    const isUpdate = !!inputId.value;
    const url = isUpdate ? `${API_BASE_URL}/${inputId.value}` : API_BASE_URL;
    const method = isUpdate ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) throw new Error(`Failed to ${isUpdate ? 'update' : 'create'} task`);

        // Close modal and refresh tasks
        modal.classList.remove('active');
        await fetchTasks();
    } catch (err) {
        alert(err.message);
    }
}

async function toggleTaskStatus(id, currentStatus) {
    const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    
    // We need to fetch the task first or send a partial update. 
    // Since our backend PUT replaces the whole object, we fetch it first.
    try {
        // Alternatively, since we have the data locally, we could perform the fetch.
        // For simplicity, we just trigger a refetch of all to find it or send a dummy update
        // We will fetch all, find it, update its status, and PUT
        const res = await fetch(`${API_BASE_URL}?userId=${currentUser.id}`);
        const tasks = await res.json();
        const task = tasks.find(t => t.id === id);
        
        if(task) {
            task.status = newStatus;
            
            await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            });
            
            await fetchTasks();
        }
    } catch (err) {
        alert('Failed to update status');
    }
}

async function deleteTask(id) {
    if(!confirm("Are you sure you want to delete this task?")) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if(!response.ok) throw new Error('Failed to delete task');
        
        await fetchTasks();
    } catch(err) {
        alert(err.message);
    }
}

// Edit function - populates the modal
function openEditModal(id, taskName, deadline, urgency, importance, effort) {
    inputId.value = id;
    inputName.value = taskName;
    inputDeadline.value = formatToDatetimeLocal(deadline);
    inputUrgency.value = urgency;
    inputImportance.value = importance;
    inputEffort.value = effort;
    
    modalTitle.textContent = "Edit Task";
    modal.classList.add('active');
}

// --- UI Rendering ---

function showLoading(isLoading) {
    if(isLoading) {
        loadingSpinner.style.display = 'block';
        taskListEl.style.display = 'none';
        emptyState.style.display = 'none';
    } else {
        loadingSpinner.style.display = 'none';
    }
}

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
}

function renderTasks(tasks) {
    taskListEl.innerHTML = '';
    
    if (tasks.length === 0) {
        taskListEl.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    taskListEl.style.display = 'block';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-card ${task.status === 'COMPLETED' ? 'completed' : ''}`;
        
        const priorityColorClass = getPriorityColorClass(task.priorityScore);
        const dateFormatted = task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No Deadline';
        
        // Use single quotes for inner JS calls or escape double quotes carefully
        li.innerHTML = `
            <div class="task-info">
                <div class="task-checkbox" onclick="toggleTaskStatus(${task.id}, '${task.status}')">
                    ${task.status === 'COMPLETED' ? '✓' : ''}
                </div>
                <div>
                    <h4 class="task-title">${escapeHTML(task.taskName)}</h4>
                    <div class="task-meta">
                        <span class="meta-item badge badge-outline">⏳ ${dateFormatted}</span>
                        <span class="meta-item badge ${priorityColorClass}">⭐️ Score: ${task.priorityScore}</span>
                    </div>
                </div>
            </div>
            <div class="task-actions">
                <button class="icon-btn edit-btn" onclick="openEditModal(${task.id}, '${escapeHTML(task.taskName).replace(/'/g, "\\'")}', '${task.deadline}', ${task.urgency}, ${task.importance}, ${task.effort})" title="Edit Task">
                    ✎
                </button>
                <button class="icon-btn delete-btn" onclick="deleteTask(${task.id})" title="Delete Task">
                    🗑️
                </button>
            </div>
        `;
        
        taskListEl.appendChild(li);
    });
}

function getPriorityColorClass(score) {
    if(score >= 12) return 'badge-danger'; // High Priority (e.g. 5 urgency *2 + 5 importance - 1 effort = 14)
    if(score >= 8) return 'badge-warning'; // Medium
    return 'badge-success'; // Low Priority
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag));
}
