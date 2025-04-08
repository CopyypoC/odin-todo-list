export class Project {
    constructor(name) {
        this.name = name;
        this.uuid = crypto.randomUUID();
    }

    #taskPrefix = 'Task: ';
    static currentProject = {};

    addTask = (task) => {
        this[this.#taskPrefix + task.uuid] = task;
    }

    removeTaskUUID = (uuid) => {
        delete this[this.#taskPrefix + uuid];
    }

    editProjectName = (newName) => {
        this.name = newName;
    }

    static updateCurrent(project) {
        this.currentProject = project;
        this.saveCurrentToStorage()
    }

    static loadCurrentFromStorage() {
        this.updateCurrent(JSON.parse(localStorage.getItem('currentProject')));
    }

    static saveCurrentToStorage() {
        localStorage.setItem('currentProject', 
                            JSON.stringify(Project.currentProject));
    }
}

