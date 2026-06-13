import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skills } from './Skills';

describe('Skills', () => {
  it('renders the Skills section heading', () => {
    render(<Skills />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Skills');
  });

  it('renders skill group categories', () => {
    render(<Skills />);
    // At minimum, Languages category should appear
    expect(screen.getByText(/Languages/i)).toBeDefined();
  });

  it('renders individual skill chips', () => {
    render(<Skills />);
    // Python is always in the Languages group
    expect(screen.getByText('Python')).toBeDefined();
    expect(screen.getByText('TypeScript')).toBeDefined();
  });
});
