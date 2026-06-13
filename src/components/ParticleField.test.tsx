import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ParticleField } from './ParticleField';

describe('ParticleField', () => {
  it('renders a canvas element when reduced motion is not preferred', () => {
    const { container } = render(<ParticleField />);
    expect(container.querySelector('canvas')).toBeTruthy();
  });

  it('canvas has aria-hidden', () => {
    const { container } = render(<ParticleField />);
    expect(container.querySelector('canvas')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders a static fallback div when reduced motion is preferred', () => {
    (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementationOnce((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const { container } = render(<ParticleField />);
    // Static fallback is a div, not canvas
    expect(container.querySelector('canvas')).toBeNull();
    expect(container.querySelector('div')).toBeTruthy();
  });
});
