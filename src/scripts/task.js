export class Task {
    constructor(title, description, date, time, priority, isCompleted = false) {
        this.title = validateText(title);
        this.description = validateText(description);
        this.dueDate = validateDate(date, time);
        this.priority = validatePriority(priority);
        this.isCompleted = isCompleted;
        this.uuid = crypto.randomUUID();
    }

    editTitle = (newTitle) => {
        this.title = newTitle;
    }

    editDescription = (newDescription) => {
        this.description = newDescription;
    }

    editDueDate = (newDueDate) => {
        this.dueDate = newDueDate;
    }

    editPriority = (newPriority) => {
        this.priority = newPriority;
    }

    editIsCompleted = (newIsCompleted) => {
        this.isCompleted = newIsCompleted;
    }
}

function validateText(text) {
    if (typeof text !== 'string') {
        throw new Error('Task title is not a string');
    }
    if (!text) {
        throw new Error('Task title is empty');
    }
    return text;
}

function validatePriority(priority) {
    if (typeof priority !== 'number') {
        throw new Error('Priority is not a number');
    }
    if (priority < 1 || priority > 4) {
        throw new Error('Priority not in range of 1-4');
    }
    return priority;
}

// Date() format YYYY-MM-DDTHH:mm, T is literally 'T' in the format for 'time'
// example: "2011-10-10T14:48:00"
function validateDate(date, time) {
    const dueDate = formatDate(date, time)
    const dateFormat = /[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]T[0-9][0-9]:[0-9][0-9]/;
    if (!dateFormat.test(dueDate)) {
        throw new Error('Due date not properly formatted - YYYY-MM-DDTHH:mm');
    }
    return dueDate;
}

// date comes in format YYYY-MM-DD from <input type='date'>
// time comes in format HH:mm from <input type='time>
function formatDate(date, time) {
    return date + 'T' + time;
}