import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './button';

describe('Button Component', () => {
  it('renders the button with the correct text', () => {
    render(<Button>Click Me</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    render(<Button className="custom-class">Click Me</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toHaveClass('custom-class');
  });
});
