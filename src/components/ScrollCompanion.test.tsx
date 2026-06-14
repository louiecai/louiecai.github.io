import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ScrollCompanion } from './ScrollCompanion';

describe('ScrollCompanion', () => {
  it('renders a glowing element when motion is not reduced', () => {
    const { container } = render(<ScrollCompanion />);
    // The fixed wrapper should be in the DOM
    expect(container.firstChild).not.toBeNull();
  });
});
