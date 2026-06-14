import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light');
  });

  it('renders a labelled toggle button', () => {
    const { getByRole } = render(<ThemeToggle />);
    expect(getByRole('button')).toHaveAttribute('aria-label');
  });

  it('toggles the light class on the document element when clicked', () => {
    const { getByRole } = render(<ThemeToggle />);
    const before = document.documentElement.classList.contains('light');
    fireEvent.click(getByRole('button'));
    const after = document.documentElement.classList.contains('light');
    expect(after).toBe(!before);
  });
});
