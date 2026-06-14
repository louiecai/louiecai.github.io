import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Logo } from './Logo';

describe('Logo', () => {
  it('renders an SVG element', () => {
    const { container } = render(<Logo />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('contains the initials LC', () => {
    render(<Logo />);
    expect(screen.getByText('LC')).toBeDefined();
  });

  it('accepts a custom size', () => {
    const { container } = render(<Logo size={48} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('48');
  });
});
