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

    getTaskFromUUID(uuid) {
        return this[taskPrefix + uuid];
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
        return JSON.parse(localStorage.getItem('currentProject'));
    }

    static saveCurrentToStorage() {
        localStorage.setItem('currentProject', 
                            JSON.stringify(currentProject));
    }
}
