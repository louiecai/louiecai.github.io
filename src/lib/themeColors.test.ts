import { describe, it, expect, afterEach, vi } from 'vitest';
import { readAccents } from './themeColors';

describe('readAccents', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.classList.remove('light');
  });

  it('converts space-separated CSS var triples to comma RGB strings', () => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: (name: string) =>
        name === '--c-cyan' ? ' 13 148 136' : ' 124 58 237',
    } as unknown as CSSStyleDeclaration);
    document.documentElement.classList.add('light');

    const a = readAccents();
    expect(a.cyan).toBe('13,148,136');
    expect(a.violet).toBe('124,58,237');
    expect(a.alphaBoost).toBeGreaterThan(1); // boosted in light mode
  });

  it('falls back to dark defaults and no boost when vars are empty', () => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration);

    const a = readAccents();
    expect(a.cyan).toBe('0,229,255');
    expect(a.violet).toBe('179,136,255');
    expect(a.alphaBoost).toBe(1);
  });
});
