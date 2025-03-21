import React from 'react';

/**
 * Footer component that displays copyright information
 * @returns JSX.Element
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} Todo Tasks. All rights reserved.
          </div>
          <div className="flex space-x-6">
          </div>
        </div>
      </div>
    </footer>
  );
}; 