export class Project {
    constructor(name) {
        this.name = name;
    }

    addTask = (task) => {
        this[task.title] = task;
    }

    removeTask = (task) => {
        delete this[task.title];
    }
}