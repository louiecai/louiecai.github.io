import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMagnetic } from './useMagnetic';

describe('useMagnetic', () => {
  it('returns ref and motion values', () => {
    const { result } = renderHook(() => useMagnetic());
    expect(result.current.ref).toBeDefined();
    expect(result.current.x).toBeDefined();
    expect(result.current.y).toBeDefined();
    expect(typeof result.current.onMouseMove).toBe('function');
    expect(typeof result.current.onMouseLeave).toBe('function');
  });
});
