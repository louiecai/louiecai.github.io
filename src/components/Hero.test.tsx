import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders name and role', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Louie Cai');
    expect(screen.getAllByText(/Software Engineer/).length).toBeGreaterThan(0);
  });

  it('renders View My Work and Resume CTAs', () => {
    render(<Hero />);
    expect(screen.getByText('View My Work')).toBeDefined();
    expect(screen.getByText('Resume')).toBeDefined();
  });

  it('renders social links', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeDefined();
  });
});
