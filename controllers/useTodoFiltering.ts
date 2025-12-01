import { Todo, TodoStatus } from '../types';

export const useTodoFiltering = (todos: Todo[], filter: TodoStatus | 'ALL') => {
    if (filter === 'ALL') return todos;
    return todos.filter((todo) => todo.status === filter);
};
