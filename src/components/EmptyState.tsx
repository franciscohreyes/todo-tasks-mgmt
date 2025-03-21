import React from 'react';

interface EmptyStateProps {
  message?: string;
}

/**
 * Component that displays a message when there are no items to show
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = 'No tasks to display. Create a new task to get started!' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
      <div className="w-16 h-16 mb-4 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tasks Yet</h3>
      <p className="text-gray-500 text-center max-w-sm">{message}</p>
    </div>
  );
}; 