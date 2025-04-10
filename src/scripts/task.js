export class Task {
    constructor(title, description, date, time, priority, 
                isCompleted = false, uuid = crypto.randomUUID()) {
        this.title = validateText(title);
        this.description = validateText(description);
        this.dueDate = validateDate(date, time);
        this.priority = validatePriority(priority);
        this.isCompleted = isCompleted;
        this.uuid = uuid;
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

export function validatePriority(priority) {
    if (typeof priority !== 'number') {
        throw new Error('Priority is not a number');
    }
    if (priority < 1 || priority > 4) {
        throw new Error('Priority not in range of 1-4');
    }
    switch (priority) {
        case 1:
            return 'Critical (1)';
        case 2:
            return 'High (2)';
        case 3:
            return 'Medium(3)';
        case 4:
            return 'Low (4)';
    }
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
export function formatDate(date, time) {
    return date + 'T' + time;
}