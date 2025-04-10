import { Project, currentProject } from "./project";
import { Task, splitDate } from "./task";
import { ProjectList, storageProjectList } from "./project-list";
import { format } from "date-fns";
import deleteIcon from "../images/red-trash.svg";

let projectList = new ProjectList();

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
        const newTitle = e.target.querySelector('#new-title');
        const newDescription = e.target.querySelector('#new-description');
        const newDueDate = e.target.querySelector('#new-due-date');
        const newTime = e.target.querySelector('#new-time');
        const newPriority = e.target.querySelector(
            'input[name="new-priority"]:checked');
        
        const newTask = new Task(
            newTitle.value, newDescription.value, newDueDate.value, 
            newTime.value, Number(newPriority.value)
        );

        currentProject.addTask(newTask);
        projectList.saveToStorage();
        console.log('Project list after add new task: ');
        console.log(projectList);
        displayNewTask(newTask);
        console.log('Current Project Task Added To:');
        console.log(currentProject);
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
        applyCompletionStyle(e);
    }
    // Edit Task
    if (e.target.className === 'task-title') {
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
    // toggle task complete
    const taskCheckbox = e.target;
    const taskItem = e.target.closest('div[class="task-item"');
    const uuid = e.target.closest('div[data-uuid]').dataset.uuid;
    const task = currentProject.getTaskFromUUID(uuid);
    const taskTitle = e.target.nextElementSibling;
    const marginTop = taskItem.offsetHeight + 'px';
    let completedTasks = []

    task.isCompleted = !task.isCompleted;
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
                const task = new Task(
                    storageTask.title, storageTask.description, dueDate[0],
                    dueDate[1], priority, undefined, storageTask.uuid
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
    }
}());
