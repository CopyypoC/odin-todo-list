export class Project {
    constructor(name) {
        this.name = name;
        this.uuid = crypto.randomUUID();
    }

    addTask = (task) => {
        this[task.uuid] = task;
    }

    removeTask = (task) => {
        delete this[task.title];
    }

    editProjectName = (newName) => {
        this.name = newName;
    }
}