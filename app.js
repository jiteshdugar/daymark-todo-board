import { createTask, moveTask, filterTasks } from './tasks.js';

const STORAGE_KEY = 'daymark.tasks.v1';
const statuses = ['todo', 'in-progress', 'done'];
let tasks = loadTasks();
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-title');

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter(task => task && typeof task.id === 'string' && typeof task.title === 'string' && statuses.includes(task.status)) : [];
  } catch { return []; }
}

function saveTasks() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
  catch { /* Keep the board usable if browser storage is unavailable. */ }
}

function render() {
  for (const status of statuses) {
    const list = document.querySelector(`#list-${status}`);
    const items = filterTasks(tasks, status);
    document.querySelector(`#count-${status}`).textContent = items.length;
    document.querySelector(`#empty-${status}`).hidden = items.length > 0;
    list.replaceChildren(...items.map(task => makeCard(task, status)));
  }
  const finished = tasks.filter(task => task.status === 'done').length;
  document.querySelector('.topbar-note').innerHTML = `<span class="live-dot"></span> ${finished ? `${finished} ${finished === 1 ? 'win' : 'wins'} and counting` : 'Your space, in focus'}`;
}

function makeCard(task, status) {
  const card = document.createElement('article');
  card.className = `task-card card-${status}`;
  const title = document.createElement('p');
  title.className = 'task-name';
  title.textContent = task.title;
  const actions = document.createElement('div');
  actions.className = 'card-actions';
  const currentIndex = statuses.indexOf(status);
  if (currentIndex > 0) actions.append(makeMoveButton(task, statuses[currentIndex - 1], '←', `Move ${task.title} to ${labelFor(statuses[currentIndex - 1])}`));
  if (currentIndex < statuses.length - 1) actions.append(makeMoveButton(task, statuses[currentIndex + 1], '→', `Move ${task.title} to ${labelFor(statuses[currentIndex + 1])}`));
  const remove = document.createElement('button');
  remove.className = 'icon-button delete-button';
  remove.type = 'button';
  remove.textContent = '×';
  remove.setAttribute('aria-label', `Delete ${task.title}`);
  remove.addEventListener('click', () => { tasks = tasks.filter(item => item.id !== task.id); saveTasks(); render(); });
  actions.append(remove);
  card.append(title, actions);
  return card;
}

function makeMoveButton(task, status, symbol, label) {
  const button = document.createElement('button');
  button.className = 'icon-button';
  button.type = 'button';
  button.textContent = symbol;
  button.setAttribute('aria-label', label);
  button.addEventListener('click', () => { tasks = moveTask(tasks, task.id, status); saveTasks(); render(); });
  return button;
}

function labelFor(status) { return status === 'todo' ? 'To do' : status === 'done' ? 'Done' : 'In progress'; }

form.addEventListener('submit', event => {
  event.preventDefault();
  const task = createTask(input.value, tasks);
  if (!task) { input.focus(); return; }
  tasks = [...tasks, task];
  saveTasks();
  render();
  form.reset();
  input.focus();
});

render();
