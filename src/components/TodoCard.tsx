import React from 'react';
import { Todo } from '../types/todo';
import { format } from 'date-fns';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';

interface TodoCardProps {
  todo: Todo;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

/**
 * A draggable card component that displays a todo item
 */
const TodoCardComponent = React.memo(({ todo, index, onDelete, onEdit }: TodoCardProps) => {
  const renderDraggableContent = React.useCallback(
    (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`bg-white rounded-lg shadow-md p-6 mb-4 transition-all duration-200 ${
          snapshot.isDragging 
            ? 'shadow-xl scale-105 ring-2 ring-blue-200' 
            : 'hover:shadow-lg hover:scale-[1.02]'
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{todo.title}</h3>
            <p className="text-gray-600 mb-3">{todo.description}</p>
            <div className="flex items-center text-sm text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Created: {format(new Date(todo.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(todo)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors duration-200 flex items-center justify-center"
              aria-label="Edit todo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200 flex items-center justify-center"
              aria-label="Delete todo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="mt-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              todo.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : todo.status === 'in-progress'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
          </span>
        </div>
      </div>
    ),
    [todo, onDelete, onEdit]
  );

  return (
    <Draggable draggableId={todo.id} index={index}>
      {renderDraggableContent}
    </Draggable>
  );
});

TodoCardComponent.displayName = 'TodoCard';

export const TodoCard = TodoCardComponent; 
