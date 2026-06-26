import { describe, it, expect } from 'vitest';
import {
  slug,
  buildFileSystem,
  normalizePath,
  resolvePath,
  formatPath,
  completionsFor,
  buildOpenTargets,
  buildBanner,
  type DirNode,
  type FileNode,
} from './terminal';
import type { Profile } from '../data/profile';

const fixture: Profile = {
  name: 'Test User',
  nameShort: 'TU',
  location: 'Somewhere, US',
  email: 'me@example.com',
  phone: '000',
  tagline: 'A short and memorable tagline.',
  resumeUrl: '/resume.pdf',
  socials: [
    { label: 'GitHub', url: 'https://github.com/x', icon: 'github' },
    { label: 'Email', url: 'mailto:me@example.com', icon: 'email' },
  ],
  experience: [
    { company: 'Acme', role: 'Engineer', period: 'Jun – Sep 2024', bullets: ['did things'] },
    { company: 'Acme', role: 'Intern', period: 'Jun – Sep 2023', bullets: ['learned things'] },
    { company: 'Globex', role: 'Tutor', period: '2022', bullets: ['taught'] },
  ],
  projects: [
    {
      name: 'Cool Mod Thing',
      description: 'A neat mod.',
      tags: ['Java', 'Gradle'],
      highlight: '2.8M+ downloads',
      type: 'personal',
    },
    { name: 'Plain Project', description: 'No highlight.', tags: ['Python'], type: 'personal' },
  ],
  skillGroups: [{ category: 'Languages', skills: ['Python', 'TypeScript', 'Rust'] }],
  education: [
    { school: 'Test University', degree: 'B.S. Testing', graduation: 'Dec 2024', gpa: '4.0' },
  ],
  activities: [],
};

function asFile(node: { type: string } | undefined): FileNode {
  if (!node || node.type !== 'file') throw new Error('expected a file node');
  return node as FileNode;
}

function asDir(node: { type: string } | undefined): DirNode {
  if (!node || node.type !== 'dir') throw new Error('expected a dir node');
  return node as DirNode;
}

describe('slug', () => {
  it('kebab-cases spaces and punctuation', () => {
    expect(slug('Minecraft Netherite Horse Armor Mod')).toBe('minecraft-netherite-horse-armor-mod');
    expect(slug('Twitter Sentiment Analysis API')).toBe('twitter-sentiment-analysis-api');
    expect(slug('  Leading & trailing! ')).toBe('leading-trailing');
  });

  it('is stable for repeated input', () => {
    expect(slug('GitHub')).toBe(slug('GitHub'));
    expect(slug('GitHub')).toBe('github');
  });
});

describe('buildFileSystem', () => {
  const fs = buildFileSystem(fixture);

  it('creates the top-level tree', () => {
    expect(Object.keys(fs.children).sort()).toEqual(
      ['about.txt', 'contact.txt', 'education.txt', 'experience', 'projects', 'skills.txt'].sort(),
    );
  });

  it('gives two same-company experiences distinct filenames', () => {
    const exp = asDir(fs.children['experience']);
    const names = Object.keys(exp.children);
    expect(names).toContain('acme-2024.md');
    expect(names).toContain('acme-2023.md');
    expect(names).toContain('globex.md'); // single occurrence stays bare
    expect(new Set(names).size).toBe(names.length); // all distinct
  });

  it('wraps a project highlight in {{ }} in its file body', () => {
    const projects = asDir(fs.children['projects']);
    const modFile = asFile(projects.children['cool-mod-thing.md']);
    expect(modFile.lines).toContain('★ {{2.8M+ downloads}}');
    expect(modFile.lines[0]).toBe('# Cool Mod Thing');

    const plain = asFile(projects.children['plain-project.md']);
    expect(plain.lines.some((l) => l.includes('{{'))).toBe(false);
  });

  it('puts the tagline in about.txt', () => {
    const about = asFile(fs.children['about.txt']);
    expect(about.lines).toContain(fixture.tagline);
  });
});

describe('normalizePath', () => {
  it('collapses . and .. and clamps past root', () => {
    expect(normalizePath(['a', '.', 'b'])).toEqual(['a', 'b']);
    expect(normalizePath(['a', 'b', '..'])).toEqual(['a']);
    expect(normalizePath(['..', '..'])).toEqual([]);
    expect(normalizePath(['', 'a', ''])).toEqual(['a']);
  });
});

describe('resolvePath', () => {
  const fs = buildFileSystem(fixture);

  it('resolves ~ to root', () => {
    const r = resolvePath(fs, ['projects'], '~');
    expect(r?.segs).toEqual([]);
    expect(r?.node.type).toBe('dir');
  });

  it('clamps .. past root to root', () => {
    const r = resolvePath(fs, [], '../../..');
    expect(r?.segs).toEqual([]);
  });

  it('resolves relative descent and absolute paths equivalently', () => {
    const rel = resolvePath(fs, [], 'projects');
    const abs = resolvePath(fs, ['skills.txt'], '~/projects');
    expect(rel?.segs).toEqual(['projects']);
    expect(abs?.segs).toEqual(['projects']);
  });

  it('resolves . to the current directory', () => {
    const r = resolvePath(fs, ['projects'], '.');
    expect(r?.segs).toEqual(['projects']);
  });

  it('returns null for a missing path', () => {
    expect(resolvePath(fs, [], 'nope')).toBeNull();
    expect(resolvePath(fs, [], 'projects/missing.md')).toBeNull();
  });

  it('returns null when descending into a file', () => {
    expect(resolvePath(fs, [], 'about.txt/whatever')).toBeNull();
  });
});

describe('formatPath', () => {
  it('renders the prompt path', () => {
    expect(formatPath([])).toBe('~');
    expect(formatPath(['projects'])).toBe('~/projects');
  });
});

describe('completionsFor', () => {
  const fs = buildFileSystem(fixture);

  it('completes command names', () => {
    expect(completionsFor('he', fs, [])).toEqual(['help']);
  });

  it('completes filenames inside a directory', () => {
    const out = completionsFor('cat cool', fs, ['projects']);
    expect(out).toEqual(['cool-mod-thing.md']);
  });

  it('marks directory candidates with a trailing slash', () => {
    const out = completionsFor('cd pro', fs, []);
    expect(out).toEqual(['projects/']);
  });
});

describe('buildOpenTargets', () => {
  it('includes socials (minus email) plus a synthetic résumé', () => {
    const targets = buildOpenTargets(fixture).map((t) => t.name);
    expect(targets).toContain('github');
    expect(targets).toContain('resume');
    expect(targets).not.toContain('email');
  });
});

describe('buildBanner', () => {
  it('derives stats from the profile', () => {
    const banner = buildBanner(fixture).join('\n');
    expect(banner).toContain('Test User');
    expect(banner).toContain('2 shipped'); // two fixture projects
  });
});
