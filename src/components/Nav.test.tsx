import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Nav } from './Nav';

// Mock IntersectionObserver (used by useActiveSection inside Nav)
const mockObserver = { observe: vi.fn(), disconnect: vi.fn() };
vi.stubGlobal('IntersectionObserver', vi.fn(() => mockObserver));

describe('Nav', () => {
  it('renders nothing before the user scrolls', () => {
    const { container } = render(<Nav />);
    // At scrollY=0 (jsdom default), nav should not be visible
    expect(container.querySelector('nav')).toBeNull();
  });

  it('shows nav links after scroll', () => {
    Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 200 });
    render(<Nav />);
    fireEvent.scroll(window);
    expect(screen.queryByText('Experience')).not.toBeNull();
    Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 0 });
  });
});
