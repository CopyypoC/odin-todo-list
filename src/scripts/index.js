// Single responsibility: 
// - project only cares about tasks
// - tasks only cares about properties


// ProjectList {
//     School {
//        Math {
//             title,
//             description,
//             dueDate,
//             priority
//        }
//        English {
//             title,
//             description,
//             dueDate,
//             priority
//         } 
//     }
//     Groceries {
//         Milk {
//             title,
//             description,
//             dueDate,
//             priority
//         }
//         Eggs {
//             title,
//             description,
//             dueDate,
//             priority
//         }
//         Beef {
//             title,
//             description,
//             dueDate,
//             priority
//         }
//     }
// }


import "../styles/style.css"
import "./user-interface";
import { Task } from "./task";
import { Project } from "./project";
import { projectList } from "./project-list";

// let project1 = new Project('Project 1');
// let task1 =   new Task('Task 1', 'Desc 1', '2025-01-01', '00:11', 1);
// projectList.addProject(project1);
// project1.addTask(task1);

// localStorage.setItem('projectList', JSON.stringify(projectList));
// console.log(localStorage);
// console.log(JSON.parse(localStorage.getItem('projectList')));



// Page loads
// Getitem for whole project list
// function getLocalProjects() {
//     projectList = JSON.parse(localStorage.getItem('projectList'));
// }
// Populate project list
// Get current project and tasks
// Populate project and task container