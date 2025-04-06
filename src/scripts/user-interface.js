// New Project Button
// New Task button
export const newTaskBtn = document.querySelector('.new-task-btn');
export const closeModalBtn = document.querySelector('.close-modal-btn');
const newTaskModal = document.querySelector('.new-task-modal');
newTaskBtn.addEventListener('click', () => {
    newTaskModal.showModal();
});
closeModalBtn.addEventListener('click', () => {
    newTaskModal.close();
});

// Project List switch project
// Click on task
// Checkbox complete for task