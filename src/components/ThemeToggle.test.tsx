import { describe, it, expect, beforeEach, vi } from 'vitest';
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
    expect(document.documentElement.classList.contains('light')).toBe(!before);
  });

  it('persists the chosen theme to localStorage', () => {
    const { getByRole } = render(<ThemeToggle />);
    fireEvent.click(getByRole('button'));
    expect(localStorage.getItem('theme')).toMatch(/^(light|dark)$/);
    const first = localStorage.getItem('theme');
    fireEvent.click(getByRole('button'));
    expect(localStorage.getItem('theme')).not.toBe(first);
  });

  it('dispatches a themechange event so canvas visuals can refresh', () => {
    const spy = vi.fn();
    window.addEventListener('themechange', spy);
    const { getByRole } = render(<ThemeToggle />);
    spy.mockClear(); // ignore the initial mount apply
    fireEvent.click(getByRole('button'));
    expect(spy).toHaveBeenCalled();
    window.removeEventListener('themechange', spy);
  });
});
