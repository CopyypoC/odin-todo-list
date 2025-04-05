export class Task {
    constructor(title, description, dueDate, priority, isCompleted = false) {
        this.title = validateText(title);
        this.description = validateText(description);
        this.dueDate = validateDate(dueDate);
        this.priority = validateNumber(priority);
        this.isCompleted = isCompleted;
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

function validateNumber(num) {
    if (typeof num !== 'number') {
        throw new Error('Priority is not a number');
    }
    if (num < 1) {
        throw new Error('Priority is less than 1');
    }
    return num;
}

// Date() format YYYY-MM-DDTHH:mm, T is literally 'T' in the format for 'time'
// example: "2011-10-10T14:48:00"
function validateDate(date) {
    const dateFormat = /[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]T[0-9][0-9]:[0-9][0-9]/;
    if (!dateFormat.test(date)) {
        throw new Error('Due date not properly formatted - YYYY-MM-DDTHH:mm');
    }
    return date;
}