// Single responsibility: 
// - project only cares about tasks
// - tasks only cares about properties


// # Project
// School {
//     # Task
//     Math {
//         title,
//         description,
//         dueDate,
//         priority
//     }
//     English {
//         title,
//         description,
//         dueDate,
//         priority
//     } 
// }
// Groceries {
//     Milk {
//         title,
//         description,
//         dueDate,
//         priority
//     }
//     Eggs {
//         title,
//         description,
//         dueDate,
//         priority
//     }
//     Beef {
//         title,
//         description,
//         dueDate,
//         priority
//     }
// }

import "../styles/style.css"
import { Task } from "./task";
import { Project } from "./project";
const projectList = {};


let school = new Project('School');
let english = new Task('English', 'essay', '1222-01-01T01:01', 1);
school.addTask(english);
console.log(school);
