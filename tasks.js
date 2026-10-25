export function createTask(title, tasks) {
  const cleanTitle = title.trim();
  if (!cleanTitle) return null;
  let n = tasks.length + 1;
  while (tasks.some(task => task.id === `task-${n}`)) n++;
  return { id: `task-${n}`, title: cleanTitle, status: 'todo' };
}

export function moveTask(tasks, id, status) {
  const valid = ['todo', 'in-progress', 'done'];
  if (!valid.includes(status)) return tasks;
  return tasks.map(task => task.id === id ? { ...task, status } : task);
}

export function filterTasks(tasks, status) {
  return tasks.filter(task => task.status === status);
}
