import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, TodoState, Todo, TodoStatus, Priority } from './types';
import { v4 as uuidv4 } from 'uuid';

// --- Auth Store ---
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, name) => set({
        user: { id: 'user-1', email, name },
        isAuthenticated: true
      }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);

// --- Todo Store ---
// --- Todo Store ---
const API_URL = 'http://localhost:8080';

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  categories: [],
  isLoading: false,
  filter: 'ALL',
  sortBy: 'createdAt',
  isGroupedByCategory: false,

  // Fetch initial data
  fetchData: async () => {
    set({ isLoading: true });
    try {
      const [todosRes, catsRes] = await Promise.all([
        fetch(`${API_URL}/todos`),
        fetch(`${API_URL}/categories`)
      ]);
      const todos = await todosRes.json();
      const categories = await catsRes.json();
      set({ todos: todos || [], categories: categories || [], isLoading: false });
    } catch (error) {
      console.error('Failed to fetch data:', error);
      set({ isLoading: false });
    }
  },

  addTodo: async (todoData) => {
    // Ensure dueDate is in ISO format if present
    const formattedDueDate = todoData.dueDate
      ? new Date(todoData.dueDate).toISOString()
      : undefined;

    const newTodo = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      subtasks: [],
      categoryIds: [],
      ...todoData,
      dueDate: formattedDueDate,
    };

    // Optimistic update
    set((state) => ({ todos: [newTodo, ...state.todos] }));

    try {
      await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      });
    } catch (error) {
      console.error('Failed to add todo:', error);
      // Revert on failure (simplified)
      get().fetchData();
    }
  },

  toggleStatus: async (id, status) => {
    const todo = get().todos.find(t => t.id === id);
    if (!todo) return;

    const updatedTodo = { ...todo, status };

    // Optimistic update
    set((state) => ({
      todos: state.todos.map((t) => t.id === id ? updatedTodo : t)
    }));

    try {
      await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });
    } catch (error) {
      console.error('Failed to update todo:', error);
      get().fetchData();
    }
  },

  deleteTodo: async (id) => {
    // Optimistic update
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id)
    }));

    try {
      await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete todo:', error);
      get().fetchData();
    }
  },

  // Subtasks (Local only for now as backend doesn't have specific subtask endpoints yet, 
  // but updating the whole todo works)
  addSubtask: async (todoId, title) => {
    const todo = get().todos.find(t => t.id === todoId);
    if (!todo) return;

    const updatedTodo = {
      ...todo,
      subtasks: [...todo.subtasks, { id: uuidv4(), title, isCompleted: false }]
    };

    set((state) => ({
      todos: state.todos.map(t => t.id === todoId ? updatedTodo : t)
    }));

    try {
      await fetch(`${API_URL}/todos/${todoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });
    } catch (error) {
      console.error('Failed to add subtask:', error);
      get().fetchData();
    }
  },

  toggleSubtask: async (todoId, subtaskId) => {
    const todo = get().todos.find(t => t.id === todoId);
    if (!todo) return;

    const updatedTodo = {
      ...todo,
      subtasks: todo.subtasks.map(s =>
        s.id === subtaskId ? { ...s, isCompleted: !s.isCompleted } : s
      )
    };

    set((state) => ({
      todos: state.todos.map(t => t.id === todoId ? updatedTodo : t)
    }));

    try {
      await fetch(`${API_URL}/todos/${todoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });
    } catch (error) {
      console.error('Failed to toggle subtask:', error);
      get().fetchData();
    }
  },

  deleteSubtask: async (todoId, subtaskId) => {
    const todo = get().todos.find(t => t.id === todoId);
    if (!todo) return;

    const updatedTodo = {
      ...todo,
      subtasks: todo.subtasks.filter(s => s.id !== subtaskId)
    };

    set((state) => ({
      todos: state.todos.map(t => t.id === todoId ? updatedTodo : t)
    }));

    try {
      await fetch(`${API_URL}/todos/${todoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });
    } catch (error) {
      console.error('Failed to delete subtask:', error);
      get().fetchData();
    }
  },

  // Categories
  addCategory: async (name, color) => {
    const newCategory = {
      id: uuidv4(),
      name,
      color: color || 'bg-gray-100 text-gray-800'
    };

    set((state) => ({
      categories: [...state.categories, newCategory]
    }));

    try {
      await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
    } catch (error) {
      console.error('Failed to add category:', error);
      get().fetchData();
    }
  },

  deleteCategory: async (id) => {
    set((state) => ({
      categories: state.categories.filter(c => c.id !== id),
      todos: state.todos.map(t => ({
        ...t,
        categoryIds: t.categoryIds.filter(cid => cid !== id)
      }))
    }));

    try {
      await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete category:', error);
      get().fetchData();
    }
  },

  // View Controls
  setFilter: (filter) => set({ filter }),
  setSortBy: (sortBy) => set({ sortBy }),
  toggleGroupBy: () => set((state) => ({ isGroupedByCategory: !state.isGroupedByCategory })),

  clearCompleted: async () => {
    const completedTodos = get().todos.filter((t) => t.status === TodoStatus.COMPLETED);

    set((state) => ({
      todos: state.todos.filter((t) => t.status !== TodoStatus.COMPLETED)
    }));

    // Delete each completed todo (could be optimized with a bulk delete endpoint)
    for (const todo of completedTodos) {
      try {
        await fetch(`${API_URL}/todos/${todo.id}`, { method: 'DELETE' });
      } catch (error) {
        console.error('Failed to delete completed todo:', error);
      }
    }
  },
}));