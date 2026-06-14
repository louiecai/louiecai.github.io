import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScrollRail } from './ScrollRail';

const mockObserver = { observe: vi.fn(), disconnect: vi.fn() };
vi.stubGlobal('IntersectionObserver', vi.fn(function() { return mockObserver; }));

describe('ScrollRail', () => {
  it('renders a dot for each section', () => {
    render(<ScrollRail />);
    const buttons = screen.getAllByRole('button', { hidden: true });
    expect(buttons.length).toBe(6); // SECTION_IDS has 6 entries
  });

  it('dots have aria-labels for accessibility', () => {
    render(<ScrollRail />);
    expect(screen.getByRole('button', { name: /Experience/i, hidden: true })).toBeDefined();
  });
});
