import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TiltCard } from './TiltCard';

describe('TiltCard', () => {
  it('renders children', () => {
    render(<TiltCard><p>Hello</p></TiltCard>);
    expect(screen.getByText('Hello')).toBeDefined();
  });

  it('renders the glow overlay', () => {
    const { container } = render(<TiltCard><p>Content</p></TiltCard>);
    // The overlay div has aria-hidden="true"
    const overlay = container.querySelector('[aria-hidden="true"]');
    expect(overlay).not.toBeNull();
  });
});
