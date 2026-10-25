import test from 'node:test';
import assert from 'node:assert/strict';
import { createTask, moveTask, filterTasks } from './tasks.js';

test('creates tasks in to-do status', () => {
  assert.deepEqual(createTask('Buy milk', []), { id: 'task-1', title: 'Buy milk', status: 'todo' });
});

test('rejects blank task titles', () => {
  assert.equal(createTask('  ', []), null);
});

test('moves a task between columns without changing other tasks', () => {
  const tasks = [{ id: 'a', title: 'A', status: 'todo' }, { id: 'b', title: 'B', status: 'done' }];
  assert.deepEqual(moveTask(tasks, 'a', 'in-progress'), [{ id: 'a', title: 'A', status: 'in-progress' }, tasks[1]]);
});

test('filters tasks by status', () => {
  const tasks = [{ id: 'a', title: 'A', status: 'todo' }, { id: 'b', title: 'B', status: 'done' }];
  assert.deepEqual(filterTasks(tasks, 'done'), [tasks[1]]);
});
