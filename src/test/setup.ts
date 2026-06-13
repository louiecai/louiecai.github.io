import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Global mock for framer-motion (avoids animation timing issues in tests)
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const tags = ['div', 'nav', 'ul', 'li', 'section', 'header', 'footer', 'span', 'p', 'a', 'button'] as const;
  const motion: Record<string, unknown> = {};
  for (const tag of tags) {
    motion[tag] = React.forwardRef(({ children, ...props }: React.HTMLAttributes<HTMLElement>, ref: React.Ref<HTMLElement>) =>
      React.createElement(tag, { ...props, ref }, children)
    );
  }
  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
    useInView: () => true,
  };
});

// Global canvas mock (for ParticleField tests)
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => ({
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    strokeStyle: '',
    lineWidth: 0,
    fillStyle: '',
  })),
});

// matchMedia mock (for usePrefersReducedMotion tests)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
