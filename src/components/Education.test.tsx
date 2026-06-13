import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Education } from './Education';

describe('Education', () => {
  it('renders the Education section heading', () => {
    render(<Education />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Education');
  });

  it('renders UC San Diego', () => {
    render(<Education />);
    expect(screen.getByText(/UC San Diego|University of California/i)).toBeDefined();
  });

  it('renders the degree', () => {
    render(<Education />);
    expect(screen.getByText(/B\.S\. Data Science/i)).toBeDefined();
  });

  it('renders the graduation date', () => {
    render(<Education />);
    expect(screen.getByText(/Dec 2024/)).toBeDefined();
  });

  it('renders the GPA', () => {
    render(<Education />);
    expect(screen.getByText(/3\.7/)).toBeDefined();
  });

  it('renders the minor', () => {
    render(<Education />);
    expect(screen.getByText(/Computer Engineering/i)).toBeDefined();
  });
});
