import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Projects } from './Projects';

describe('Projects', () => {
  it('renders the Projects section heading', () => {
    render(<Projects />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Projects');
  });

  it('renders the Minecraft mod with its download highlight', () => {
    render(<Projects />);
    // The Minecraft mod has highlight: '2.8M+ downloads'
    expect(screen.getByText(/2\.8M\+/)).toBeDefined();
  });

  it('renders both Professional and Side Projects groups', () => {
    render(<Projects />);
    expect(screen.getByText(/Professional/i)).toBeDefined();
    expect(screen.getByText(/Side Projects/i)).toBeDefined();
  });
});
