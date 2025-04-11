import { Project, currentProject } from "./project";
import { Task, formatDate, validatePriority } from "./task";
import { ProjectList, storageProjectList } from "./project-list";
import { format } from "date-fns";
import deleteIcon from "../images/red-trash.svg";

let projectList = new ProjectList();
let currentTask = {};

const closeModalBtns = document.querySelectorAll('.close-modal-btn');
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('dialog').close();
    })
})

const newTaskModal = document.querySelector('.new-task-modal');
document.querySelector('.new-task-btn')
    .addEventListener('click', () => {
        newTaskModal.showModal();
});

const newProjectModal = document.querySelector('.new-project-modal');
document.querySelector('.new-project-btn')
    .addEventListener('click', () => {
        newProjectModal.showModal();
});

// Make new task from modal form submit
document.querySelector('.new-task-modal')
    .addEventListener('submit', (e) => {
        e.preventDefault();
        const description = document.getElementById('edit-description');
        const newTitle = e.target.querySelector('#new-title');
        const newDescription = e.target.querySelector('#new-description');
        const newDate = e.target.querySelector('#new-due-date');
        const newTime = e.target.querySelector('#new-time');
        const newPriority = e.target.querySelector(
            'input[name="new-priority"]:checked');
        const newTask = new Task(
            newTitle.value, newDescription.value, newDate.value, 
            newTime.value, Number(newPriority.value)
        );

        description.value = newTask.description;
        currentProject.addTask(newTask);
        projectList.saveToStorage();
        displayNewTask(newTask);
});

const taskListContainer = document.querySelector('.task-list-container');
function displayNewTask(newTask) {
    const taskItem = Object.assign(document.createElement('div'), {
        className: 'task-item'
    });

    const taskContainer = Object.assign(document.createElement('div'), {
        className: 'task-container',
    });
    taskContainer.setAttribute('data-uuid', newTask.uuid);

    const taskCheckbox = Object.assign(document.createElement('input'), {
        type: 'checkbox',
        name: 'complete',
        'aria-label': 'task-checkbox',
        className: 'task-checkbox',
    });

    const taskTitle = Object.assign(document.createElement('p'), {
        className: 'task-title',
        textContent: newTask.title,
    });

    const taskDueDate = Object.assign(document.createElement('p'), {
        className: 'task-due-date',
        textContent: format(new Date(newTask.dueDate), 'MM/dd/yy hh:mm bb'),
    });

    const deleteImg = Object.assign(document.createElement('img'), {
        src: deleteIcon,
        alt: 'Delete icon',
        className: 'task-delete-icon',
    })

    const taskPriority = Object.assign(document.createElement('p'), {
        className: 'task-priority',
        textContent: newTask.priority,
    })

    taskListContainer.appendChild(taskItem);
    taskItem.appendChild(taskContainer);
    taskContainer.append(taskCheckbox, taskTitle, taskDueDate, 
                        deleteImg, taskPriority);
    taskItem.appendChild(document.createElement('hr'));
}

const editTaskModal = document.querySelector('.edit-task-modal');
taskListContainer.addEventListener('click', (e) => {
    // Delete
    if (e.target.className === 'task-delete-icon') {
        deleteTaskDOM(e);
    }
    // Checkbox
    if (e.target.classList.contains('task-checkbox')) {
        const uuid = e.target.closest('div[data-uuid]').dataset.uuid;
        currentTask = currentProject.getTaskFromUUID(uuid);
        applyCompletionStyle(e);
    }
    // Edit Task
    if (e.target.className === 'task-title') {
        const uuid = e.target.closest('div[data-uuid]').dataset.uuid;
        currentTask = currentProject.getTaskFromUUID(uuid);
        fillFormValues();
        editTaskModal.showModal();
    }
})

function deleteTaskDOM(e) {
    const uuid = e.target.closest('div[data-uuid]').dataset.uuid;

    currentProject.removeTaskUUID(uuid);
    projectList.saveToStorage();
    taskListContainer.replaceChildren();
    displayProject();
}

function applyCompletionStyle(e) {
    const taskCheckbox = e.target;
    const taskItem = e.target.closest('div[class="task-item"');
    const uuid = e.target.closest('div[data-uuid]').dataset.uuid;
    const task = currentProject.getTaskFromUUID(uuid);
    const taskTitle = e.target.nextElementSibling;
    const marginTop = taskItem.offsetHeight + 'px';
    let completedTasks = []

    // Prevent toggle on programmatic clicks
    if (e.pointerType !== '') {
        task.isCompleted = !task.isCompleted;
    }

    if (task.isCompleted === true) {
        taskCheckbox.checked = true;
        taskTitle.style.textDecoration = 'line-through';
        taskItem.style.order = '1';
        resetMarginTop(completedTasks);
        completedTasks[0].style.marginTop = marginTop;
    }

    if (task.isCompleted === false) {
        taskCheckbox.checked = false;
        taskItem.style.order = '0';
        resetMarginTop(completedTasks);
        if (completedTasks.length) {
            completedTasks[0].style.marginTop = marginTop;
        }

        taskTitle.style.textDecoration = '';
    }
    Project.updateCurrent(currentProject);
    projectList.saveToStorage();
}

function resetMarginTop(completedTasks) {
    for (const child of taskListContainer.children) {
        if (child.style.order === '1') {
            completedTasks.push(child);
        }
    }

    for (const child of taskListContainer.children) {
        child.style.marginTop = '';
    }
}

function fillFormValues() {
    const dateSplit = currentTask.dueDate.split('T');
    const indexOfNum = currentTask.priority.search(/[1-4]/);
    const priority = Number(currentTask.priority[indexOfNum]);
    const checkbox = document.querySelector(`#edit-priority-${priority}`);

    editTitle.value = currentTask.title;
    editDescription.value = currentTask.description;
    editDate.value = dateSplit[0];
    editTime.value = dateSplit[1];
    checkbox.checked = true;
}

document.querySelector('.edit-task-modal')
    .addEventListener('submit', (e) => {
        e.preventDefault();
        editCurrentTask(e);
        editCurrentTaskDOM();
});

const editTitle = document.querySelector('#edit-title');
const editDescription = document.querySelector('#edit-description');
const editDate = document.querySelector('#edit-due-date');
const editTime = document.querySelector('#edit-time');

function editCurrentTask(e) {
    const tempDate = editDate.value;
    const tempTime = editTime.value;
    const editPriority = e.target.querySelector(
        'input[name="edit-priority"]:checked');

    currentTask.title = editTitle.value;
    currentTask.description = editDescription.value;
    currentTask.dueDate = formatDate(editDate.value, editTime.value);
    currentTask.priority = validatePriority(Number(editPriority.value));

    editTitle.value = currentTask.title;
    editDescription.value = currentTask.description;
    editDate.value = tempDate;
    editTime.value = tempTime;
    editPriority.checked = true;
    
    projectList.saveToStorage();
}

function editCurrentTaskDOM() {
    for (const child of taskListContainer.children) {
        if (child.firstElementChild.dataset.uuid === currentTask.uuid) {
            const title = child.querySelector('.task-title');
            const dueDate = child.querySelector('.task-due-date');
            const priority = child.querySelector('.task-priority');

            title.textContent = currentTask.title;
            dueDate.textContent = format(new Date(currentTask.dueDate), 'MM/dd/yy hh:mm bb');
            priority.textContent = currentTask.priority;
        }
    }
}

// Make new project from modal form submit
document.querySelector('.new-project-modal')
    .addEventListener('submit', (e) => {
        const newProjectName = e.target.querySelector('#new-project-name');
        const newProject = new Project(newProjectName.value);
        
        e.preventDefault();
        projectList.addProject(newProject);
        displayNewProjectTitle(newProject);
        console.log('New Project List:');
        console.log(projectList);
});

const projectListUl = document.querySelector('.project-list'); 
function displayNewProjectTitle(newProject) {
    const projectTitle = Object.assign(document.createElement('li'), {
        className: 'project-title',
        textContent: newProject.name,
    });
    projectTitle.setAttribute('data-uuid', newProject.uuid);
    projectListUl.appendChild(projectTitle);
}

// Swap between projects
document.querySelector('.project-list').addEventListener('click', (e) => {
    switchCurrentProject(e);
    taskListContainer.replaceChildren();
    displayProject();

    console.log(`Switched Current Project: ${currentProject.name}`);
    console.log(currentProject);
});

function switchCurrentProject(e) {
    if (e.target.className === 'project-title') {
        // For...of loop gets key, value pairs from entries() which is a
        // array holding arrays of key value pairs. For...in loop iterates
        // the indices instead of the key value pairs.
        for (const [key, project] of Object.entries(projectList.projects)) {
            if (key.includes(e.target.dataset.uuid)) {
                Project.updateCurrent(project);
            }
        }
    }
}

function displayProject() {
    const taskProjectTitle = document.querySelector('.task-project-title');
    taskProjectTitle.textContent = currentProject.name;

    for (const task of Object.values(currentProject)) {
        if (task instanceof Task) {
            displayNewTask(task);
        }
    }
}

function deserializeProjectList() {
    for (const storageProj of Object.values(storageProjectList.projects)) {
        // Instantiate project and attach to projectlist.projects
        const project = new Project(storageProj.name, storageProj.uuid)
        Project.updateCurrent(project);
        projectList.addProject(project);
        
        for (const [key, storageTask] of Object.entries(storageProj)) {
            // Instantiate task and attach to project
            if (key.includes('Task: ')) {
                const dueDate = storageTask.dueDate.split('T');
                const indexOfNum = storageTask.priority.search(/[1-4]/);
                const priority = Number(storageTask.priority[indexOfNum]);
                const isCompleted = storageTask.isCompleted;
                const task = new Task(
                    storageTask.title, storageTask.description, dueDate[0],
                    dueDate[1], priority, isCompleted, storageTask.uuid
                );
                currentProject.addTask(task);
            }
        }
    }
}

// Initial Rendering
(function() {
    // Default creation on empty project list
    if (localStorage.getItem('projectList') === null) {
        const defaultProject = new Project('Default Project');

        Project.updateCurrent(defaultProject);
        projectList.addProject(defaultProject);
        displayNewProjectTitle(defaultProject);
    } else {
        let tempProject = Project.loadCurrentFromStorage();

        deserializeProjectList();
        // Update storage currentProject to instantiated one 
        for (const [key, project] of Object.entries(projectList.projects)) {
            if (key.includes(tempProject.uuid)) {
                Project.updateCurrent(project);
                tempProject = currentProject;
            }
        }
        Project.updateCurrent(tempProject);

        for (const project of Object.values(projectList.projects)) {
            displayNewProjectTitle(project);
        }
        displayProject();

        for (const task of Object.values(currentProject)) {
            if (task instanceof Task) {
                if (task.isCompleted) {
                    document.querySelector(`div[data-uuid="${task.uuid}"]`)
                        .firstElementChild.click();

                    task.isCompleted = true;
                    Project.updateCurrent(currentProject);
                    projectList.saveToStorage();
                }
            }
        }
    }
}());