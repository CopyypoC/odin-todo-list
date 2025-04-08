const projectPrefix = 'Project: ';

class ProjectList {
    constructor() {
        this.projects = {};
    }

    addProject = (project) => {
        this.projects[projectPrefix + project.uuid] = project;
        this.saveToStorage();
    }
    removeProjectUUID = (uuid) => {
        delete this.projects[projectPrefix + uuid];
        this.saveToStorage();
    }

    loadFromStorage() {
        const projectList = JSON.parse
            (localStorage.getItem('projectList')) || {};
        if (projectList.projects) {
            this.projects = projectList.projects;
        }
    }

    saveToStorage() {
        localStorage.setItem('projectList', JSON.stringify(this));
    }
}

export let projectList = new ProjectList();
projectList.loadFromStorage();