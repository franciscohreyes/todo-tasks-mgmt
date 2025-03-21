import React from 'react';
import { Todo, TodoStatus } from '../types/todo';
import { TodoCard } from './TodoCard';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from '@hello-pangea/dnd';
import { EmptyState } from './EmptyState';

interface TodoColumnProps {
  id: TodoStatus;
  title: string;
  todos: Todo[];
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  isDragging: boolean;
}

/**
 * Column component that displays a list of todos with the same status
 */
const TodoColumnComponent = React.memo(({ id, title, todos, onDelete, onEdit, isDragging }: TodoColumnProps) => {
  // Sort todos by order
  const sortedTodos = React.useMemo(() => 
    [...todos].sort((a, b) => a.order - b.order),
    [todos]
  );

  const renderDroppableContent = React.useCallback(
    (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className={`p-4 rounded-lg transition-all duration-200 min-h-[500px] ${
          snapshot.isDraggingOver
            ? 'bg-blue-50 ring-2 ring-blue-200'
            : 'bg-white'
        } ${isDragging ? 'shadow-lg' : 'shadow-md'}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <span className="px-2 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
              {sortedTodos.length}
            </span>
          </div>
        </div>
        <div className="space-y-4">
          {sortedTodos.length > 0 ? (
            sortedTodos.map((todo, index) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                index={index}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))
          ) : (
            <EmptyState 
              message={`No tasks in ${title}. Drag and drop tasks here or create new ones.`}
            />
          )}
          {provided.placeholder}
        </div>
      </div>
    ),
    [sortedTodos, onDelete, onEdit, isDragging, title]
  );

  return (
    <div className="flex-1 min-w-[300px]">
      <Droppable droppableId={id}>
        {renderDroppableContent}
      </Droppable>
    </div>
  );
});

TodoColumnComponent.displayName = 'TodoColumn';

export const TodoColumn = TodoColumnComponent;