// Pure, side-effect-free core for the interactive Terminal: a virtual filesystem
// built from `profile.ts`, path resolution, tab-completion, and the command
// registry. All rendering, state, and DOM side-effects live in the component.

import type { ExperienceItem, ProjectItem, Profile } from '../data/profile';

export interface FileNode {
  type: 'file';
  lines: string[];
}

export interface DirNode {
  type: 'dir';
  children: Record<string, FSNode>;
}

export type FSNode = FileNode | DirNode;

/** Kebab-case an arbitrary label into a filesystem-safe slug. Stable per input. */
export function slug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Return a key not already present in `existing`, suffixing `-2`, `-3`, … */
function uniqueKey(existing: Record<string, unknown>, desired: string): string {
  if (!(desired in existing)) return desired;
  const dot = desired.lastIndexOf('.');
  const stem = dot >= 0 ? desired.slice(0, dot) : desired;
  const ext = dot >= 0 ? desired.slice(dot) : '';
  let i = 2;
  while (`${stem}-${i}${ext}` in existing) i++;
  return `${stem}-${i}${ext}`;
}

/** First four-digit year in a free-form period string, or '' if none. */
function yearOf(period: string): string {
  const m = period.match(/\d{4}/);
  return m ? m[0] : '';
}

function experienceFileName(exp: ExperienceItem, all: ExperienceItem[]): string {
  const base = slug(exp.company);
  const sameCompany = all.filter((e) => slug(e.company) === base);
  // Single occurrence → bare slug (stripe.md). Duplicates → disambiguate by
  // year extracted from the period (amazon-2024.md, amazon-2023.md).
  if (sameCompany.length <= 1) return `${base}.md`;
  const year = yearOf(exp.period);
  return year ? `${base}-${year}.md` : `${base}.md`;
}

function aboutLines(p: Profile): string[] {
  const lead = p.experience[0];
  const lines = [`# ${p.name}`, p.tagline, ''];
  lines.push(lead ? `${lead.role} @ ${lead.company} · ${p.location}.` : p.location);
  lines.push(
    `Reach me at ${p.email}.`,
    '',
    'Type `ls` to look around, or `help` for commands.',
  );
  return lines;
}

function experienceLines(e: ExperienceItem): string[] {
  const lines = [`# ${e.role} · ${e.company}`, e.period, ''];
  for (const b of e.bullets) lines.push(`- ${b}`);
  return lines;
}

function projectLines(pr: ProjectItem): string[] {
  const lines = [`# ${pr.name}`, pr.description, '', `tags: ${pr.tags.join(' · ')}`];
  if (pr.highlight) lines.push(`★ {{${pr.highlight}}}`);
  return lines;
}

function skillsLines(p: Profile): string[] {
  const lines: string[] = [];
  p.skillGroups.forEach((g, i) => {
    if (i > 0) lines.push('');
    lines.push(`# ${g.category}`, g.skills.join(' · '));
  });
  return lines;
}

function educationLines(p: Profile): string[] {
  const lines: string[] = [];
  p.education.forEach((ed, i) => {
    if (i > 0) lines.push('');
    lines.push(`# ${ed.degree}`, ed.school, `Graduated ${ed.graduation} · GPA ${ed.gpa}`);
    if (ed.minor) lines.push(`Minor: ${ed.minor}`);
    if (ed.coursework) lines.push('', `Coursework: ${ed.coursework}`);
  });
  return lines;
}

function contactLines(p: Profile): string[] {
  const lines = ['# Contact', '', `${'email'.padEnd(9)} ${p.email}   (try: email)`];
  for (const s of p.socials) {
    if (s.icon === 'email') continue; // handled by the dedicated `email` command
    const name = slug(s.label);
    lines.push(`${name.padEnd(9)} ${s.url}   (try: open ${name})`);
  }
  lines.push(`${'resume'.padEnd(9)} ${p.resumeUrl}   (try: resume)`);
  return lines;
}

/** Build the virtual filesystem tree from the profile (single source of truth). */
export function buildFileSystem(profile: Profile): DirNode {
  const root: DirNode = { type: 'dir', children: {} };

  root.children['about.txt'] = { type: 'file', lines: aboutLines(profile) };

  const expDir: DirNode = { type: 'dir', children: {} };
  for (const exp of profile.experience) {
    const name = uniqueKey(expDir.children, experienceFileName(exp, profile.experience));
    expDir.children[name] = { type: 'file', lines: experienceLines(exp) };
  }
  root.children['experience'] = expDir;

  const projDir: DirNode = { type: 'dir', children: {} };
  for (const proj of profile.projects) {
    const name = uniqueKey(projDir.children, `${slug(proj.name)}.md`);
    projDir.children[name] = { type: 'file', lines: projectLines(proj) };
  }
  root.children['projects'] = projDir;

  root.children['skills.txt'] = { type: 'file', lines: skillsLines(profile) };
  root.children['education.txt'] = { type: 'file', lines: educationLines(profile) };
  root.children['contact.txt'] = { type: 'file', lines: contactLines(profile) };

  return root;
}

/** Collapse `.` and `..` segments. `..` past root is clamped to root. */
export function normalizePath(segs: string[]): string[] {
  const out: string[] = [];
  for (const s of segs) {
    if (s === '.' || s === '') continue;
    if (s === '..') {
      out.pop();
      continue;
    }
    out.push(s);
  }
  return out;
}

/**
 * Resolve `arg` against `cwd` within `root`. Supports `~`/absolute (leading
 * `~` or `/`) and relative paths, plus `.`/`..`. Returns the resolved segments
 * and node, or `null` if any segment is missing or descends into a file.
 */
export function resolvePath(
  root: DirNode,
  cwd: string[],
  arg?: string,
): { segs: string[]; node: FSNode } | null {
  const a = arg ?? '';
  const absolute = a.startsWith('~') || a.startsWith('/');
  const base = absolute ? [] : [...cwd];
  const rest = absolute ? a.replace(/^[~/]/, '') : a;
  const tokens = rest.split('/').filter((t) => t.length > 0);
  const segs = normalizePath([...base, ...tokens]);

  let node: FSNode = root;
  for (const seg of segs) {
    if (node.type !== 'dir') return null;
    const child: FSNode | undefined = node.children[seg];
    if (!child) return null;
    node = child;
  }
  return { segs, node };
}

/** Render path segments as a shell-style prompt path (`~`, `~/projects`). */
export function formatPath(segs: string[]): string {
  return segs.length === 0 ? '~' : `~/${segs.join('/')}`;
}

export interface HelpEntry {
  name: string;
  args: string;
  desc: string;
}

export const HELP: readonly HelpEntry[] = [
  { name: 'help', args: '', desc: 'show this help' },
  { name: 'ls', args: '[path]', desc: 'list a directory' },
  { name: 'cd', args: '[path]', desc: 'change directory' },
  { name: 'cat', args: '<file>', desc: 'print a file' },
  { name: 'pwd', args: '', desc: 'print working directory' },
  { name: 'whoami', args: '', desc: 'a little about me' },
  { name: 'open', args: '<name>', desc: 'open a link in a new tab' },
  { name: 'email', args: '', desc: 'compose an email to me' },
  { name: 'resume', args: '', desc: 'open my résumé' },
  { name: 'theme', args: '', desc: 'toggle light / dark' },
  { name: 'echo', args: '<text>', desc: 'print text' },
  { name: 'history', args: '', desc: 'show command history' },
  { name: 'date', args: '', desc: 'show the current date' },
  { name: 'banner', args: '', desc: 'show the boot banner (alias: neofetch)' },
  { name: 'clear', args: '', desc: 'clear the screen' },
];

export const COMMANDS: readonly string[] = [
  ...HELP.map((h) => h.name),
  'neofetch',
  'sudo',
  'vim',
  'rm',
];

/**
 * Candidate completions for a Tab press. When the input is still a single token
 * it completes against command names; otherwise it path-completes the last token
 * against `cwd`. Directory candidates carry a trailing `/`.
 */
export function completionsFor(input: string, root: DirNode, cwd: string[]): string[] {
  const parts = input.split(' ');
  if (parts.length === 1) {
    const frag = parts[0];
    return COMMANDS.filter((c) => c.startsWith(frag)).sort();
  }

  const frag = parts[parts.length - 1];
  const slashIdx = frag.lastIndexOf('/');
  const dirPart = slashIdx >= 0 ? frag.slice(0, slashIdx + 1) : '';
  const namePart = slashIdx >= 0 ? frag.slice(slashIdx + 1) : frag;

  const resolved = resolvePath(root, cwd, dirPart || '.');
  if (!resolved || resolved.node.type !== 'dir') return [];

  const dir = resolved.node;
  return Object.keys(dir.children)
    .filter((n) => n.startsWith(namePart))
    .sort()
    .map((n) => `${dirPart}${n}${dir.children[n].type === 'dir' ? '/' : ''}`);
}

export interface OpenTarget {
  name: string;
  url: string;
}

/** Buildable `open` targets: every social (except email) plus a synthetic résumé. */
export function buildOpenTargets(p: Profile): OpenTarget[] {
  const targets = p.socials
    .filter((s) => s.icon !== 'email')
    .map((s) => ({ name: slug(s.label), url: s.url }));
  targets.push({ name: 'resume', url: p.resumeUrl });
  return targets;
}

/** A neofetch-style boot banner: ASCII logo, then live stats from the profile. */
export function buildBanner(p: Profile): string[] {
  const lead = p.experience[0];
  const stack = (p.skillGroups[0]?.skills ?? []).slice(0, 3).join(' · ');
  const links = p.socials
    .filter((s) => s.icon !== 'email')
    .map((s) => slug(s.label))
    .join(' · ');

  const info: string[] = [
    'host      {{louie@portfolio}}',
    `name      {{${p.name}}}`,
  ];
  if (lead) info.push(`role      {{${lead.role} @ ${lead.company}}}`);
  info.push(
    `where     {{${p.location}}}`,
    `stack     {{${stack}}}`,
    `projects  {{${p.projects.length} shipped}}`,
    `roles     {{${p.experience.length} listed}}`,
    `links     {{${links}}}`,
  );

  return [
    '{{  _      ____ }}',
    '{{ | |    / ___|}}',
    '{{ | |   | |    }}',
    '{{ | |___| |___ }}',
    '{{ |_____|\\____|}}',
    '',
    ...info,
    '',
    'Type `help` for commands, or `ls` to explore.',
  ];
}
