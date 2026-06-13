import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import { useActiveSection } from './useActiveSection';

describe('usePrefersReducedMotion', () => {
  it('returns false when matchMedia reports no preference', () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns true when matchMedia reports prefers-reduced-motion', () => {
    (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementationOnce((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });
});

describe('useActiveSection', () => {
  it('returns the first section id as initial active section', () => {
    // jsdom does not implement IntersectionObserver; mock it
    const mockObserver = { observe: vi.fn(), disconnect: vi.fn() };
    vi.stubGlobal('IntersectionObserver', vi.fn(() => mockObserver));

    const { result } = renderHook(() =>
      useActiveSection(['about', 'experience', 'projects'])
    );
    expect(result.current).toBe('about');

    vi.unstubAllGlobals();
  });
});
