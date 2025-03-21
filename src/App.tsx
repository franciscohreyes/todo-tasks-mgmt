import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
// Components
import { TodoColumn } from './components/TodoColumn';
import { TodoForm } from './components/TodoForm';
import { EmptyState } from './components/EmptyState';
import { Navbar } from './components/Navbar';
import { Modal } from './components/Modal';
import { Footer } from './components/Footer';
// Types
import { CreateTodoInput, Todo, TodoStatus, UpdateTodoInput } from './types/todo';
// Services
import { todoService } from './services/todoService';
// Hooks
import { useDarkMode } from './hooks/useDarkMode';

/**
 * Main application component that manages the todo list state and interactions
 */
function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  useEffect(() => {
    loadTodos();
  }, []);

  // Update document class when dark mode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const loadTodos = async () => {
    try {
      const loadedTodos = await todoService.getTodos();
      // Sort todos by order first, then by creation date as fallback
      const sortedTodos = [...loadedTodos].sort((a, b) => {
        if (a.status === b.status) {
          return a.order - b.order;
        }
        return 0;
      });
      setTodos(sortedTodos);
    } catch (err) {
      setError('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = useCallback(async (todo: CreateTodoInput) => {
    try {
      if (editingTodo) {
        const updateData: UpdateTodoInput = {
          id: editingTodo.id,
          title: todo.title,
          description: todo.description,
          status: editingTodo.status
        };
        const updatedTodo = await todoService.updateTodo(updateData);
        setTodos(prevTodos => 
          prevTodos.map(t => t.id === editingTodo.id ? updatedTodo : t)
        );
      } else {
        const newTodo = await todoService.createTodo(todo);
        setTodos(prevTodos => [newTodo, ...prevTodos]); // Add new todo at the beginning
      }
      setEditingTodo(null);
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save todo');
    }
  }, [editingTodo]);

  const handleDeleteTodo = useCallback(async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter((todo) => todo.id !== id));
      setEditingTodo(null);
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to delete todo');
    }
  }, []);

  const handleEditTodo = useCallback((todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingTodo(null);
    setIsModalOpen(false);
  }, []);

  const handleAddTask = useCallback(() => {
    setEditingTodo(null);
    setIsModalOpen(true);
  }, []);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(async (result: DropResult) => {
    setIsDragging(false);
    
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    try {
      if (source.droppableId === destination.droppableId) {
        // Reordering within the same column
        const status = source.droppableId as TodoStatus;
        const updatedTodo = await todoService.updateTodoOrder(draggableId, destination.index, status);
        
        // Update the todos state to reflect the new order
        setTodos(prevTodos => {
          const newTodos = [...prevTodos];
          const sourceIndex = newTodos.findIndex(t => t.id === draggableId);
          const [movedTodo] = newTodos.splice(sourceIndex, 1);
          
          // Get all todos for the current status
          const statusTodos = newTodos.filter(t => t.status === status);
          
          // Find the correct position to insert the moved todo
          const insertIndex = newTodos.findIndex(t => t.status === status) + destination.index;
          
          // Insert the todo at the new position
          newTodos.splice(insertIndex, 0, movedTodo);
          
          // Update order for all todos in the status
          const updatedStatusTodos = newTodos.filter(t => t.status === status);
          updatedStatusTodos.forEach((todo, index) => {
            todo.order = index;
          });
          
          return newTodos;
        });
      } else {
        // Moving between columns
        const newStatus = destination.droppableId as TodoStatus;
        const updatedTodo = await todoService.updateTodoStatus(draggableId, newStatus);
        
        // Update the todos state to reflect the new status and order
        setTodos(prevTodos => {
          const newTodos = [...prevTodos];
          const sourceIndex = newTodos.findIndex(t => t.id === draggableId);
          const [movedTodo] = newTodos.splice(sourceIndex, 1);
          
          // Get all todos for the new status
          const statusTodos = newTodos.filter(t => t.status === newStatus);
          
          // Find the correct position to insert the moved todo in the new status
          const insertIndex = newTodos.findIndex(t => t.status === newStatus) + destination.index;
          
          // Insert the todo at the new position
          newTodos.splice(insertIndex, 0, updatedTodo);
          
          // Update order for all todos in the new status
          const updatedStatusTodos = newTodos.filter(t => t.status === newStatus);
          updatedStatusTodos.forEach((todo, index) => {
            todo.order = index;
          });
          
          return newTodos;
        });
      }
    } catch (err) {
      setError('Failed to update todo');
    }
  }, []);

  const columns = [
    { id: 'todo' as TodoStatus, title: 'To Do' },
    { id: 'in-progress' as TodoStatus, title: 'In Progress' },
    { id: 'completed' as TodoStatus, title: 'Completed' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <Navbar
        onAddTask={handleAddTask}
        onEditTask={handleEditTodo}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      <main className="flex-1 container mx-auto px-4 py-8">
        {error && (
          <div className="text-center text-red-500">{error}</div>
        )}
        <div className="text-sm text-gray-500 py-4">
          {todos.length} {todos.length === 1 ? 'task' : 'tasks'} in total
        </div>

        {todos.length > 0 ? (
          <DragDropContext 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {columns.map((column) => (
                <TodoColumn
                  id={column.id}
                  title={column.title}
                  todos={todos.filter((todo) => todo.status === column.id)}
                  onDelete={handleDeleteTodo}
                  onEdit={handleEditTodo}
                  isDragging={isDragging}
                />
              ))}
            </div>
          </DragDropContext>
        ) : (
          <EmptyState 
            message="Get started by creating your first task! Use the Add Task button to create a new task."
          />
        )}
      </main>
      <Footer />
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTodo(null);
          }}
        >
          <TodoForm
            onSubmit={handleCreateTodo}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingTodo(null);
            }}
            todoToEdit={editingTodo}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;