import { Priority, Todo } from '../types';

type SortOption = 'priority' | 'dueDate' | 'createdAt';

const PRIORITY_VALUES = {
    [Priority.HIGH]: 3,
    [Priority.MEDIUM]: 2,
    [Priority.LOW]: 1,
};

export const useTodoSorting = (todos: Todo[], sortBy: SortOption) => {
    const strategies: Record<SortOption, (a: Todo, b: Todo) => number> = {
        priority: (a, b) => PRIORITY_VALUES[b.priority] - PRIORITY_VALUES[a.priority],
        dueDate: (a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        },
        createdAt: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    };

    return [...todos].sort(strategies[sortBy] || strategies.createdAt);
};
