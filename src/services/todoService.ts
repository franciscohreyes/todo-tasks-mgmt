import axios from 'axios';
import { CreateTodoInput, Todo, TodoStatus, UpdateTodoInput } from '../types/todo';

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_TYPE = import.meta.env.VITE_STORAGE_TYPE;

/**
 * Service class for handling Todo operations
 */
class TodoService {
  private storage: Storage;

  constructor() {
    this.storage = STORAGE_TYPE === 'local' ? new LocalStorage() : new ApiStorage();
  }

  async getTodos(): Promise<Todo[]> {
    return this.storage.getTodos();
  }

  async createTodo(todo: CreateTodoInput): Promise<Todo> {
    return this.storage.createTodo(todo);
  }

  async updateTodo(todo: UpdateTodoInput): Promise<Todo> {
    return this.storage.updateTodo(todo);
  }

  async deleteTodo(id: string): Promise<void> {
    return this.storage.deleteTodo(id);
  }

  async updateTodoStatus(id: string, status: TodoStatus): Promise<Todo> {
    return this.storage.updateTodoStatus(id, status);
  }

  async updateTodoOrder(id: string, newIndex: number, status: TodoStatus): Promise<Todo> {
    return this.storage.updateTodoOrder(id, newIndex, status);
  }
}

/**
 * Interface for storage implementations
 */
interface Storage {
  getTodos(): Promise<Todo[]>;
  createTodo(todo: CreateTodoInput): Promise<Todo>;
  updateTodo(todo: UpdateTodoInput): Promise<Todo>;
  deleteTodo(id: string): Promise<void>;
  updateTodoStatus(id: string, status: TodoStatus): Promise<Todo>;
  updateTodoOrder(id: string, newIndex: number, status: TodoStatus): Promise<Todo>;
}

/**
 * LocalStorage implementation
 */
class LocalStorage implements Storage {
  private readonly STORAGE_KEY = 'todos';

  private getTodosFromStorage(): Todo[] {
    const todos = localStorage.getItem(this.STORAGE_KEY);
    return todos ? JSON.parse(todos) : [];
  }

  private saveTodosToStorage(todos: Todo[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
  }

  async getTodos(): Promise<Todo[]> {
    return this.getTodosFromStorage();
  }

  async createTodo(todo: CreateTodoInput): Promise<Todo> {
    const todos = this.getTodosFromStorage();
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      ...todo,
      createdAt: new Date(),
      completed: false,
      status: 'todo',
      order: 0 // New tasks go to the top
    };
    
    // Shift all existing todos down by one
    todos.forEach(t => t.order += 1);
    
    todos.unshift(newTodo); // Add to the beginning
    this.saveTodosToStorage(todos);
    return newTodo;
  }

  async updateTodo(todo: UpdateTodoInput): Promise<Todo> {
    const todos = this.getTodosFromStorage();
    const index = todos.findIndex((t) => t.id === todo.id);
    if (index === -1) throw new Error('Todo not found');
    
    todos[index] = { ...todos[index], ...todo };
    this.saveTodosToStorage(todos);
    return todos[index];
  }

  async deleteTodo(id: string): Promise<void> {
    const todos = this.getTodosFromStorage();
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    this.saveTodosToStorage(filteredTodos);
  }

  async updateTodoStatus(id: string, status: TodoStatus): Promise<Todo> {
    const todos = this.getTodosFromStorage();
    const todoIndex = todos.findIndex((t) => t.id === id);
    if (todoIndex === -1) throw new Error('Todo not found');

    const [todo] = todos.splice(todoIndex, 1);
    const updatedTodo = { ...todo, status };
    
    // Get todos for the new status
    const statusTodos = todos.filter(t => t.status === status);
    
    // Add to the beginning of the new status
    statusTodos.unshift(updatedTodo);
    
    // Update order for all todos in the new status
    statusTodos.forEach((todo, index) => {
      todo.order = index;
    });

    // Update the todos array with the new order
    const updatedTodos = todos.filter(t => t.status !== status).concat(statusTodos);
    this.saveTodosToStorage(updatedTodos);
    
    return updatedTodo;
  }

  async updateTodoOrder(id: string, newIndex: number, status: TodoStatus): Promise<Todo> {
    const todos = this.getTodosFromStorage();
    const todoIndex = todos.findIndex((t) => t.id === id);
    if (todoIndex === -1) throw new Error('Todo not found');

    const [todo] = todos.splice(todoIndex, 1);
    
    // Get all todos for the same status
    const statusTodos = todos.filter(t => t.status === status);
    
    // Insert at the new position
    statusTodos.splice(newIndex, 0, todo);

    // Update order for all todos in the status
    statusTodos.forEach((todo, index) => {
      todo.order = index;
    });

    // Update the todos array with the new order
    const updatedTodos = todos.filter(t => t.status !== status).concat(statusTodos);
    this.saveTodosToStorage(updatedTodos);
    
    return todo;
  }
}

/**
 * API Storage implementation
 */
class ApiStorage implements Storage {
  async getTodos(): Promise<Todo[]> {
    const response = await axios.get(`${API_URL}/todos`);
    return response.data;
  }

  async createTodo(todo: CreateTodoInput): Promise<Todo> {
    const response = await axios.post(`${API_URL}/todos`, todo);
    return response.data;
  }

  async updateTodo(todo: UpdateTodoInput): Promise<Todo> {
    const response = await axios.patch(`${API_URL}/todos/${todo.id}`, todo);
    return response.data;
  }

  async deleteTodo(id: string): Promise<void> {
    await axios.delete(`${API_URL}/todos/${id}`);
  }

  async updateTodoStatus(id: string, status: TodoStatus): Promise<Todo> {
    return this.updateTodo({ id, status });
  }

  async updateTodoOrder(id: string, newIndex: number, status: TodoStatus): Promise<Todo> {
    const response = await axios.patch(`${API_URL}/todos/${id}/order`, { newIndex });
    return response.data;
  }
}

export const todoService = new TodoService(); 