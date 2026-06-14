import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DecodeText } from './DecodeText';

describe('DecodeText', () => {
  it('shows the real text immediately (before animation starts)', () => {
    render(<DecodeText text="Experience" start={false} />);
    expect(screen.getByText('Experience')).toBeDefined();
  });

  it('shows the real text when start=true (rAF not fired in jsdom)', () => {
    render(<DecodeText text="Projects" start={true} />);
    // rAF doesn't fire synchronously in jsdom, so initial state (= real text) is shown
    expect(screen.getByText('Projects')).toBeDefined();
  });
});
