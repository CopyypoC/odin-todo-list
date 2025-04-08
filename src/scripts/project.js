import { projectList } from "./project-list";

const taskPrefix = 'Task: ';

export class Project {
    constructor(name) {
        this.name = name;
        this.uuid = crypto.randomUUID();
    }

    static currentProject = {};

    static addTask = (task) => {
        this.currentProject[taskPrefix + task.uuid] = task;
    }
 
    static removeTaskUUID = (uuid) => {
        delete this.currentProject[taskPrefix + uuid];
    }

    static editProjectName = (newName) => {
        this.currentProject.name = newName;
    }

    static updateCurrent(project) {
        this.currentProject = project;
        this.saveCurrentToStorage()
    }

    static loadCurrentFromStorage() {
        const projectCopy = JSON.parse(localStorage.getItem('currentProject'));
        for (const [key, project] of Object.entries(projectList.projects)) {
            if (key.includes(projectCopy.uuid)) {
                this.updateCurrent(project);
            }
        }
    }

    static saveCurrentToStorage() {
        localStorage.setItem('currentProject', 
                            JSON.stringify(this.currentProject));
    }
}

// MAKE EVERYTHING STATIC MAYBE? ALWAYS JUST KEEPING TRACK OF CURRENT
// ALSO UPDATE PROJECT LIST STORAGE WHENEVER ADDING/REMOVE/EDITING ETC.
// Loading from storage is just a copy and not a refernce to the original
// Get original project in projectlist and copy the currentProject into it