import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock IntersectionObserver (Nav uses useActiveSection)
// Must be a proper constructor (not an arrow function) so `new IntersectionObserver(...)` works
const mockObserver = { observe: vi.fn(), disconnect: vi.fn() };
vi.stubGlobal(
  'IntersectionObserver',
  vi.fn(function () {
    return mockObserver;
  }),
);

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Hero is always rendered (no scroll gate)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Louie Cai');
  });

  it('renders all section headings', () => {
    render(<App />);
    const h2s = screen.getAllByRole('heading', { level: 2 }).map((el) => el.textContent);
    expect(h2s).toContain('Experience');
    expect(h2s).toContain('Projects');
    expect(h2s).toContain('Skills');
    expect(h2s).toContain('Activities');
    expect(h2s).toContain('Education');
    expect(h2s).toContain('Get in Touch');
  });
});
