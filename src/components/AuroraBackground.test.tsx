import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AuroraBackground } from './AuroraBackground';

describe('AuroraBackground', () => {
  it('renders the aurora layer', () => {
    const { container } = render(<AuroraBackground />);
    expect(container.firstChild).not.toBeNull();
  });
});
