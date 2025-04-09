import { storageProjectList } from "./project-list";

const taskPrefix = 'Task: ';
export let currentProject = {};

export class Project {
    constructor(name, uuid = crypto.randomUUID()) {
        this.name = name;
        this.uuid = uuid;
    }

    addTask = (task) => {
        this[taskPrefix + task.uuid] = task;
    }
 
    removeTaskUUID = (uuid) => {
        delete this[taskPrefix + uuid];
    }

    editProjectName = (newName) => {
        this.name = newName;
    }

    static updateCurrent(project) {
        currentProject = project;
        this.saveCurrentToStorage()
    }

    static loadCurrentFromStorage() {
        const projectCopy = JSON.parse(localStorage.getItem('currentProject'));
        for (const [key, project] of Object.entries(storageProjectList.projects)) {
            if (key.includes(projectCopy.uuid)) {
                this.updateCurrent(project);
            }
        }
    }

    static saveCurrentToStorage() {
        localStorage.setItem('currentProject', 
                            JSON.stringify(currentProject));
    }
}

// MAKE EVERYTHING STATIC MAYBE? ALWAYS JUST KEEPING TRACK OF CURRENT
// ALSO UPDATE PROJECT LIST STORAGE WHENEVER ADDING/REMOVE/EDITING ETC.
// Loading from storage is just a copy and not a refernce to the original
// Get original project in projectlist and copy the currentProject into it