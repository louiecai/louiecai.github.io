import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountUp } from './CountUp';

describe('CountUp', () => {
  it('shows the full value immediately before animation', () => {
    render(<CountUp value="2.8M+ downloads" />);
    expect(screen.getByText('2.8M+ downloads')).toBeDefined();
  });

  it('shows ordinal value correctly', () => {
    render(<CountUp value="4th Place" />);
    expect(screen.getByText('4th Place')).toBeDefined();
  });
});
