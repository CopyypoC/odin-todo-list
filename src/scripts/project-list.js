const projectPrefix = 'Project: ';

export class ProjectList {
    constructor() {
        this.projects = {};
    }

    addProject = (project) => {
        this.projects[projectPrefix + project.uuid] = project;
        if (!(`${projectPrefix}${project.uuid}` in 
                storageProjectList.projects)) {
            this.saveToStorage();
        }
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

export let storageProjectList = new ProjectList();
storageProjectList.loadFromStorage();