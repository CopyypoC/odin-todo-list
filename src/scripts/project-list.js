export const projectList = {
    addProject(project) {
        this[projectPrefix + project.uuid] = project;
    },
    removeProjectUUID(uuid) {
        delete this[projectPrefix + uuid];
    },
}

const projectPrefix = 'Project: ';