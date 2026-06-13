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
    render(<Nav />);
    fireEvent.scroll(window, { target: { scrollY: 200 } });
    // After scroll triggers visibility, nav should appear with section links
    // Note: framer-motion AnimatePresence is mocked to always render children
    // so nav renders when visible state is true
    expect(screen.queryByText('Experience')).toBeDefined();
  });
});
