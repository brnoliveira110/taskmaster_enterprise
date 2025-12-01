export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum TodoStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string; // CSS color or Tailwind class
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: Priority;
  createdAt: string; // ISO Date string
  userId: string;

  // New features
  dueDate?: string; // ISO Date string
  categoryIds: string[];
  subtasks: Subtask[];
}

// MVC: This acts as our Model definition
export interface TodoState {
  todos: Todo[];
  categories: Category[];
  isLoading: boolean;
  filter: TodoStatus | 'ALL';
  sortBy: 'createdAt' | 'dueDate' | 'priority';
  isGroupedByCategory: boolean;

  // Actions
  fetchData: () => Promise<void>;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'subtasks'>) => void;
  toggleStatus: (id: string, status: TodoStatus) => void;
  deleteTodo: (id: string) => void;

  // Subtask Actions
  addSubtask: (todoId: string, title: string) => void;
  toggleSubtask: (todoId: string, subtaskId: string) => void;
  deleteSubtask: (todoId: string, subtaskId: string) => void;

  // Category Actions
  addCategory: (name: string, color?: string) => void;
  deleteCategory: (id: string) => void;

  // View Actions
  setFilter: (status: TodoStatus | 'ALL') => void;
  setSortBy: (sort: 'createdAt' | 'dueDate' | 'priority') => void;
  toggleGroupBy: () => void;
  clearCompleted: () => void;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;
}