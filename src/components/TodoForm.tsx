import React, { useState, useEffect } from 'react';
import { CreateTodoInput, Todo } from '../types/todo';

interface TodoFormProps {
  onSubmit: (todo: CreateTodoInput) => void;
  todoToEdit?: Todo | null;
  onCancel?: () => void;
}

/**
 * Form component for creating and editing todo items with validation
 */
export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, todoToEdit, onCancel }) => {
  const [formData, setFormData] = useState<CreateTodoInput>({
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState<Partial<CreateTodoInput>>({});

  useEffect(() => {
    if (todoToEdit) {
      setFormData({
        title: todoToEdit.title,
        description: todoToEdit.description,
      });
    } else {
      setFormData({
        title: '',
        description: '',
      });
    }
    setErrors({});
  }, [todoToEdit]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateTodoInput> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      if (!todoToEdit) {
        setFormData({ title: '', description: '' });
        setErrors({});
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof CreateTodoInput]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="p-8 mb-8 transform transition-all duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {todoToEdit ? 'Edit Task' : 'Create New Task'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
            Title
          </label>
          <div className="relative">
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 placeholder-gray-400 ${
                errors.title 
                  ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                  : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Enter task title"
            />
            {errors.title && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>
          {errors.title && (
            <p className="text-sm text-red-600 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.title}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
            Description
          </label>
          <div className="relative">
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 placeholder-gray-400 resize-none ${
                errors.description 
                  ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                  : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Enter task description"
            />
            {errors.description && (
              <div className="absolute right-3 top-3">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>
          {errors.description && (
            <p className="text-sm text-red-600 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.description}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          {todoToEdit && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            {todoToEdit ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}; 