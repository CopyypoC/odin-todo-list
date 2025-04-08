import { Project } from "./project";
import { Task } from "./task";
import { projectList } from "./project-list";
import { format } from "date-fns";

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

const editTaskModal = document.querySelector('.edit-task-modal');
// document.querySelector('.task-title')
//     .addEventListener('click', () => {
//         editTaskModal.showModal();
// });

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

        Project.currentProject.addTask(newTask);
        displayNewTask(newTask);
        console.log('Current Project Task Added To:');
        console.log(Project.currentProject);
});

const taskListContainer = document.querySelector('.task-list-container');
function displayNewTask(newTask) {
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

    const taskPriority = Object.assign(document.createElement('p'), {
        className: 'task-priority',
        textContent: newTask.priority,
    })

    taskListContainer.appendChild(taskContainer);
    taskContainer.append(taskCheckbox, taskTitle, taskDueDate, taskPriority);
    taskListContainer.appendChild(document.createElement('hr'));
}

// Make new project from modal form submit
document.querySelector('.new-project-modal')
    .addEventListener('submit', (e) => {
        e.preventDefault();
        const newProjectName = e.target.querySelector('#new-project-name');
        const newProject = new Project(newProjectName.value);

        Project.currentProject = newProject;
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
    
    console.log(`Switched Current Project: ${Project.currentProject.name}`);
    console.log(Project.currentProject);
});

function switchCurrentProject(e) {
    if (e.target.className === 'project-title') {
        // For...of loop gets key, value pairs from entries() which is a
        // array holding arrays of key value pairs. For...in loop iterates
        // the indices instead of the key value pairs.
        for (const [key, value] of Object.entries(projectList)) {
            if (key.includes(e.target.dataset.uuid)) {
                Project.currentProject = value;
            }
        }
    }
}

function displayProject() {

}

// Create default project
(function() {
    if (localStorage.getItem('projectList') === null) {
        const defaultProject = new Project('Default Project');
        Project.currentProject = defaultProject;
        projectList.addProject(defaultProject);
        displayNewProjectTitle(defaultProject);
    }
}());
