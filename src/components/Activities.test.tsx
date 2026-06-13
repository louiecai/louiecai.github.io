import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Activities } from './Activities';

describe('Activities', () => {
  it('renders the Activities section heading', () => {
    render(<Activities />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Activities');
  });

  it('renders F1TENTH with 4th place highlight', () => {
    render(<Activities />);
    expect(screen.getByText(/F1TENTH|F1 Tenth|Robotics/i)).toBeDefined();
    expect(screen.getAllByText(/4th Place|4th/i).length).toBeGreaterThan(0);
  });

  it('renders the activity date', () => {
    render(<Activities />);
    expect(screen.getByText(/Jun 2023/)).toBeDefined();
  });

  it('renders bullet points', () => {
    render(<Activities />);
    const markers = screen.getAllByText('▸');
    expect(markers.length).toBeGreaterThan(0);
  });
});
