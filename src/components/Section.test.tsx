import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Section } from './Section';

describe('Section', () => {
  it('renders children with the section id', () => {
    render(
      <Section id="experience" title="Experience">
        <p>Content here</p>
      </Section>
    );
    expect(document.getElementById('experience')).not.toBeNull();
    expect(screen.getByText('Content here')).toBeDefined();
  });

  it('renders the section title as h2', () => {
    render(
      <Section id="skills" title="Skills">
        <span>Skill chips</span>
      </Section>
    );
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.textContent).toBe('Skills');
  });
});
