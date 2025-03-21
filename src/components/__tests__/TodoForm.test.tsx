import { render, screen, fireEvent } from '@testing-library/react';
import { TodoForm } from '../TodoForm';
import { vi } from 'vitest';

describe('TodoForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form elements correctly', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
  });

  it('shows error message when submitting empty form', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /add todo/i }));

    expect(screen.getByText(/title and description are required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with form data when submitting valid form', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Todo' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test Description' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Todo',
      description: 'Test Description',
    });
    expect(screen.queryByText(/title and description are required/i)).not.toBeInTheDocument();
  });

  it('clears form after successful submission', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    fireEvent.change(titleInput, { target: { value: 'Test Todo' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }));

    expect(titleInput).toHaveValue('');
    expect(descriptionInput).toHaveValue('');
  });
}); 