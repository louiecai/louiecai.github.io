import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MagneticButton } from './MagneticButton';

describe('MagneticButton', () => {
  it('renders its children', () => {
    render(<MagneticButton><button>Click me</button></MagneticButton>);
    expect(screen.getByText('Click me')).toBeDefined();
  });
});
