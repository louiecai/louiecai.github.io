import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders Get in Touch heading', () => {
    render(<Footer />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Get in Touch');
  });

  it('renders social links', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeDefined();
  });

  it('renders copyright with Louie Cai', () => {
    render(<Footer />);
    expect(screen.getByText(/Louie Cai/)).toBeDefined();
  });

  it('renders email mailto link', () => {
    render(<Footer />);
    const emailLink = screen.getByRole('link', { name: /me@louiecai\.com/i });
    expect(emailLink.getAttribute('href')).toBe('mailto:me@louiecai.com');
  });
});
