import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Experience } from './Experience';

describe('Experience', () => {
  it('renders the Experience section heading', () => {
    render(<Experience />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Experience');
  });

  it('renders Stripe as the first job', () => {
    render(<Experience />);
    expect(screen.getAllByText(/Stripe/)[0]).toBeDefined();
  });

  it('renders two Amazon entries', () => {
    render(<Experience />);
    const amazonEntries = screen.getAllByText(/Amazon/);
    expect(amazonEntries.length).toBeGreaterThanOrEqual(2);
  });

  it('renders UC San Diego entry', () => {
    render(<Experience />);
    expect(screen.getByText(/UC San Diego/)).toBeDefined();
  });

  it('renders period strings', () => {
    render(<Experience />);
    expect(screen.getByText(/Feb 2025/)).toBeDefined();
  });

  it('renders bullet points for each job', () => {
    render(<Experience />);
    // Each bullet is preceded by ▸ marker
    const markers = screen.getAllByText('▸');
    expect(markers.length).toBeGreaterThan(0);
  });
});
