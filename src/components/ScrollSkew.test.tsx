import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollSkew } from './ScrollSkew';

describe('ScrollSkew', () => {
  it('renders children', () => {
    render(
      <ScrollSkew>
        <p>Content</p>
      </ScrollSkew>
    );
    expect(screen.getByText('Content')).toBeDefined();
  });
});
