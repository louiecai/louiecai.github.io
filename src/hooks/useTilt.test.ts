import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTilt } from './useTilt';

describe('useTilt', () => {
  it('returns ref and handlers', () => {
    const { result } = renderHook(() => useTilt());
    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.onMouseMove).toBe('function');
    expect(typeof result.current.onMouseLeave).toBe('function');
  });
});
