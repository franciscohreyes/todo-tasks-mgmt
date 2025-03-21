/**
 * Represents the status of a todo task
 */
export type TodoStatus = 'todo' | 'in-progress' | 'completed';

/**
 * Interface for a Todo task
 */
export interface Todo {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  completed: boolean;
  status: TodoStatus;
  order: number;
}

/**
 * Interface for creating a new Todo task
 */
export interface CreateTodoInput {
  title: string;
  description: string;
}

/**
 * Interface for updating a Todo task
 */
export interface UpdateTodoInput {
  id: string;
  title?: string;
  description?: string;
  status?: TodoStatus;
}

/**
 * Interface for the Todo column structure
 */
export interface TodoColumn {
  id: TodoStatus;
  title: string;
  todos: Todo[];
} 