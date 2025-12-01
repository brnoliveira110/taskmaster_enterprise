import { useTodoStore } from '../store';
import { TodoStatus } from '../types';
import { useTodoFiltering } from './useTodoFiltering';
import { useTodoSorting } from './useTodoSorting';
import { useCategoryManager } from './useCategoryManager';

export const useDashboardController = () => {
    const {
        todos, filter, categories, sortBy, isGroupedByCategory,
        setFilter, setSortBy, toggleGroupBy, clearCompleted
    } = useTodoStore();

    const {
        newCategoryName,
        setNewCategoryName,
        showCatManager,
        setShowCatManager,
        handleAddCategory,
        deleteCategory
    } = useCategoryManager();

    // --- Filtering Logic ---
    const filteredTodos = useTodoFiltering(todos, filter);

    // --- Sorting Logic ---
    const sortedTodos = useTodoSorting(filteredTodos, sortBy);

    const activeCount = todos.filter(t => t.status !== TodoStatus.COMPLETED).length;

    return {
        // State
        todos,
        filter,
        categories,
        sortBy,
        isGroupedByCategory,
        newCategoryName,
        showCatManager,
        sortedTodos,
        activeCount,

        // Actions
        setFilter,
        setSortBy,
        toggleGroupBy,
        clearCompleted,
        deleteCategory,
        setNewCategoryName,
        setShowCatManager,
        handleAddCategory,
    };
};
