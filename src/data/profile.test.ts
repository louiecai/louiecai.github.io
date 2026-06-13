import { describe, it, expect } from 'vitest';
import { profile } from './profile';

describe('profile data', () => {
  it('has required identity fields', () => {
    expect(profile.name).toBe('Louie Cai');
    expect(profile.email).toBe('me@louiecai.com');
    expect(profile.location).toBe('Seattle, WA');
    expect(profile.resumeUrl).toBe('/resume.pdf');
  });

  it('has Stripe as the first (current) experience', () => {
    expect(profile.experience[0].company).toBe('Stripe');
    expect(profile.experience[0].period).toContain('Present');
  });

  it('has at least 3 experience entries', () => {
    expect(profile.experience.length).toBeGreaterThanOrEqual(3);
  });

  it('has UCSD education entry', () => {
    expect(profile.education[0].school).toContain('San Diego');
    expect(profile.education[0].gpa).toBe('3.7');
  });

  it('has at least 5 skill groups', () => {
    expect(profile.skillGroups.length).toBeGreaterThanOrEqual(5);
  });

  it('has the Minecraft mod project with highlight', () => {
    const mod = profile.projects.find((p) => p.name.toLowerCase().includes('minecraft'));
    expect(mod).toBeDefined();
    expect(mod!.highlight).toContain('2.8M');
  });

  it('all projects have a type of professional or personal', () => {
    for (const p of profile.projects) {
      expect(['professional', 'personal']).toContain(p.type);
    }
  });
});
