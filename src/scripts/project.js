export class Project {
    constructor(name) {
        this.name = name;
        this.uuid = crypto.randomUUID();
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
}

const taskPrefix = 'Task: ';