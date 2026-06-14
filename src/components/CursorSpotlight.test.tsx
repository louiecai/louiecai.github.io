import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CursorSpotlight } from './CursorSpotlight';

describe('CursorSpotlight', () => {
  it('renders the spotlight layer (non-coarse, non-reduced environment)', () => {
    // matchMedia mocked to matches:false and window.matchMedia returns coarse=false
    const { container } = render(<CursorSpotlight />);
    // Should render the div (matches:false means not reduced, not coarse)
    expect(container.firstChild).not.toBeNull();
  });
});
