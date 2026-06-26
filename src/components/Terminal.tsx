import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { profile } from '../data/profile';
import {
  HELP,
  buildBanner,
  buildFileSystem,
  buildOpenTargets,
  completionsFor,
  formatPath,
  resolvePath,
} from '../lib/terminal';

interface TerminalProps {
  /** App passes useTheme().toggle; tests pass a mock. */
  onThemeToggle?: () => void;
}

type OutputLine =
  | { kind: 'in'; cwd: string[]; text: string }
  | { kind: 'out'; text: string };

/** Result of running one command: the new cwd, output lines, and a clear flag. */
interface ExecResult {
  cwd: string[];
  out: string[];
  clear?: boolean;
}

/** Mirror useTheme's side-effects when no onThemeToggle prop is provided. */
function fallbackToggleTheme(): void {
  const root = document.documentElement;
  const next = root.classList.toggle('light') ? 'light' : 'dark';
  window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
  try {
    localStorage.setItem('theme', next);
  } catch {
    /* localStorage may be unavailable; theme still toggles visually */
  }
}

function longestCommonPrefix(items: string[]): string {
  if (items.length === 0) return '';
  let prefix = items[0];
  for (const item of items.slice(1)) {
    while (!item.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

/** Render `{{accent}}` spans inside an output line. */
function renderInline(text: string): ReactNode {
  const parts = text.split(/(\{\{.*?\}\})/g);
  return parts.map((part, i) => {
    const m = part.match(/^\{\{(.*)\}\}$/);
    if (m) {
      return (
        <span key={i} className="text-cyan">
          {m[1]}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function OutputLineView({ line }: { line: OutputLine }) {
  if (line.kind === 'in') {
    return (
      <div className="whitespace-pre-wrap break-words">
        <span className="text-cyan">louie@portfolio:{formatPath(line.cwd)}$ </span>
        <span className="text-fg">{line.text}</span>
      </div>
    );
  }
  if (line.text.startsWith('# ')) {
    return (
      <div className="whitespace-pre-wrap break-words font-semibold text-cyan">
        {line.text.slice(2)}
      </div>
    );
  }
  return (
    <div className="whitespace-pre-wrap break-words text-fg">
      {line.text ? renderInline(line.text) : ' '}
    </div>
  );
}

export function Terminal({ onThemeToggle }: TerminalProps) {
  const reduced = usePrefersReducedMotion();
  const fs = useMemo(() => buildFileSystem(profile), []);
  const openTargets = useMemo(() => buildOpenTargets(profile), []);

  const [open, setOpen] = useState(false);
  const [cwd, setCwd] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<OutputLine[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const prevOpen = useRef(open);
  const bootedRef = useRef(false);
  const openRef = useRef(open);

  const promptStr = `louie@portfolio:${formatPath(cwd)}$ `;

  // Print the boot banner the first time the terminal is opened.
  const openTerminal = useCallback(() => {
    if (!bootedRef.current) {
      bootedRef.current = true;
      setLines(buildBanner(profile).map((text) => ({ kind: 'out', text })));
    }
    setOpen(true);
  }, []);

  // ⌘K / Ctrl+K toggles; Esc closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (openRef.current) setOpen(false);
        else openTerminal();
      } else if (e.key === 'Escape' && openRef.current) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-terminal', openTerminal);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-terminal', openTerminal);
    };
  }, [openTerminal]);

  // Track open state for the window handler; move focus into the input on open
  // and restore it to the launcher on close.
  useEffect(() => {
    openRef.current = open;
    if (open && !prevOpen.current) inputRef.current?.focus();
    if (!open && prevOpen.current) launcherRef.current?.focus();
    prevOpen.current = open;
  }, [open]);

  // Keep the latest output in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, open]);

  function execOne(raw: string, workingCwd: string[]): ExecResult {
    const trimmed = raw.trim();
    if (!trimmed) return { cwd: workingCwd, out: [] };
    const [cmd, ...args] = trimmed.split(/\s+/);
    const arg = args[0];

    switch (cmd) {
      case 'help': {
        const out = ['Available commands:', ''];
        for (const h of HELP) {
          out.push(`  ${`${h.name} ${h.args}`.trim().padEnd(16)} ${h.desc}`);
        }
        return { cwd: workingCwd, out };
      }
      case 'ls': {
        const res = resolvePath(fs, workingCwd, arg);
        if (!res) return { cwd: workingCwd, out: [`ls: ${arg}: No such file or directory`] };
        if (res.node.type === 'file') return { cwd: workingCwd, out: [arg ?? formatPath(res.segs)] };
        const dir = res.node;
        const names = Object.keys(dir.children)
          .sort()
          .map((n) => (dir.children[n].type === 'dir' ? `${n}/` : n));
        return { cwd: workingCwd, out: [names.join('  ')] };
      }
      case 'cd': {
        if (!arg) return { cwd: [], out: [] };
        const res = resolvePath(fs, workingCwd, arg);
        if (!res) return { cwd: workingCwd, out: [`cd: ${arg}: No such file or directory`] };
        if (res.node.type === 'file') return { cwd: workingCwd, out: [`cd: ${arg}: Not a directory`] };
        return { cwd: res.segs, out: [] };
      }
      case 'cat': {
        if (!arg) return { cwd: workingCwd, out: ['cat: missing operand'] };
        const res = resolvePath(fs, workingCwd, arg);
        if (!res) return { cwd: workingCwd, out: [`cat: ${arg}: No such file or directory`] };
        if (res.node.type === 'dir') return { cwd: workingCwd, out: [`cat: ${arg}: Is a directory`] };
        return { cwd: workingCwd, out: [...res.node.lines] };
      }
      case 'pwd':
        return { cwd: workingCwd, out: [formatPath(workingCwd)] };
      case 'whoami': {
        const res = resolvePath(fs, [], 'about.txt');
        return {
          cwd: workingCwd,
          out: res && res.node.type === 'file' ? [...res.node.lines] : [profile.name],
        };
      }
      case 'clear':
        return { cwd: workingCwd, out: [], clear: true };
      case 'history':
        return {
          cwd: workingCwd,
          out: cmdHistory.map((c, i) => `${String(i + 1).padStart(4)}  ${c}`),
        };
      case 'echo':
        return { cwd: workingCwd, out: [args.join(' ').replace(/^["']|["']$/g, '')] };
      case 'date':
        return { cwd: workingCwd, out: [new Date().toString()] };
      case 'banner':
      case 'neofetch':
        return { cwd: workingCwd, out: buildBanner(profile) };
      case 'open': {
        const names = openTargets.map((t) => t.name).join(', ');
        if (!arg) return { cwd: workingCwd, out: ['open: missing target', `available: ${names}`] };
        const target = openTargets.find((t) => t.name === arg.toLowerCase());
        if (!target) {
          return { cwd: workingCwd, out: [`open: ${arg}: unknown target`, `available: ${names}`] };
        }
        window.open(target.url, '_blank', 'noopener,noreferrer');
        return { cwd: workingCwd, out: [`Opening ${target.name}…`] };
      }
      case 'email':
        window.open(`mailto:${profile.email}`, '_blank');
        return { cwd: workingCwd, out: [`Opening your mail client to ${profile.email}…`] };
      case 'resume':
        window.open(profile.resumeUrl, '_blank', 'noopener,noreferrer');
        return { cwd: workingCwd, out: ['Opening résumé…'] };
      case 'theme':
        if (onThemeToggle) onThemeToggle();
        else fallbackToggleTheme();
        return { cwd: workingCwd, out: ['Theme toggled.'] };
      case 'sudo':
        return {
          cwd: workingCwd,
          out: ['sudo: nice try — but you already have root on this portfolio. 😄'],
        };
      case 'vim':
        return {
          cwd: workingCwd,
          out: ['vim launched… just kidding. Press Esc to leave (you can check out any time).'],
        };
      case 'rm': {
        const joined = args.join(' ');
        if (/-\w*r\w*f|-\w*f\w*r|-rf|-fr/.test(joined)) {
          return { cwd: workingCwd, out: ['rm: this portfolio is immutable. Your files are safe. 🛡️'] };
        }
        return { cwd: workingCwd, out: ['rm: command disabled in this sandbox.'] };
      }
      default:
        return { cwd: workingCwd, out: [`command not found: ${cmd}`] };
    }
  }

  function run(raw: string) {
    const trimmed = raw.trim();
    if (trimmed) setCmdHistory((h) => [...h, trimmed]);
    setHistoryIndex(null);

    let workingCwd = cwd;
    const collected: OutputLine[] = [{ kind: 'in', cwd, text: raw }];
    let doClear = false;
    for (const seg of raw.split('&&')) {
      const r = execOne(seg, workingCwd);
      workingCwd = r.cwd;
      if (r.clear) {
        doClear = true;
        collected.length = 0;
      }
      for (const text of r.out) collected.push({ kind: 'out', text });
    }
    if (workingCwd !== cwd) setCwd(workingCwd);
    if (doClear) setLines(collected);
    else setLines((prev) => [...prev, ...collected]);
  }

  function navHistory(dir: -1 | 1) {
    if (cmdHistory.length === 0) return;
    let next =
      historyIndex === null
        ? dir === -1
          ? cmdHistory.length - 1
          : cmdHistory.length
        : historyIndex + dir;
    if (next < 0) next = 0;
    if (next >= cmdHistory.length) {
      setHistoryIndex(null);
      setInput('');
      return;
    }
    setHistoryIndex(next);
    setInput(cmdHistory[next]);
  }

  function doComplete() {
    const cands = completionsFor(input, fs, cwd);
    if (cands.length === 0) return;
    const parts = input.split(' ');
    if (cands.length === 1) {
      const c = cands[0];
      if (parts.length === 1) setInput(`${c} `);
      else {
        parts[parts.length - 1] = c;
        setInput(parts.join(' ') + (c.endsWith('/') ? '' : ' '));
      }
      return;
    }
    parts[parts.length - 1] = longestCommonPrefix(cands);
    setInput(parts.join(' '));
    setLines((prev) => [...prev, { kind: 'out', text: cands.join('  ') }]);
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      run(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navHistory(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navHistory(1);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      doComplete();
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={openTerminal}
        aria-label="Open terminal (Command or Control + K)"
        aria-haspopup="dialog"
        className={`fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full border border-cyan/50 bg-surface/80 px-4 py-2.5 font-mono text-sm text-cyan shadow-[0_0_12px_rgb(var(--c-cyan)/0.25)] backdrop-blur transition-all hover:border-cyan hover:shadow-[0_0_20px_rgb(var(--c-cyan)/0.4)] hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50 ${
          open ? 'hidden' : ''
        }`}
      >
        <span>{'>_'}</span>
        <span>Terminal</span>
        <kbd className="rounded border border-border px-1 text-[10px] text-muted">⌘K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex justify-center bg-bg/50 px-3 backdrop-blur-sm sm:px-4"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Interactive terminal"
              className="glass mt-[7vh] flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl shadow-2xl"
              initial={reduced ? false : { opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? {} : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: reduced ? 0 : 0.18 }}
              onClick={() => inputRef.current?.focus()}
            >
              <div className="flex items-center gap-2 border-b border-border/70 px-4 py-2">
                <span className="h-3 w-3 rounded-full bg-border" aria-hidden="true" />
                <span className="h-3 w-3 rounded-full bg-border" aria-hidden="true" />
                <span className="h-3 w-3 rounded-full bg-border" aria-hidden="true" />
                <span className="flex-1 text-center font-mono text-xs text-muted">
                  louie@portfolio — zsh
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close terminal"
                  className="rounded px-1 text-muted transition-colors hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50"
                >
                  ✕
                </button>
              </div>

              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed text-fg"
              >
                {lines.map((line, i) => (
                  <OutputLineView key={i} line={line} />
                ))}

                <div className="flex whitespace-pre-wrap break-words">
                  <span className="text-cyan">{promptStr}</span>
                  <div className="relative flex-1">
                    <span className="whitespace-pre-wrap break-words text-fg">
                      {input}
                      <span
                        data-testid="terminal-cursor"
                        aria-hidden="true"
                        className={`ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.15em] bg-cyan/80 ${
                          reduced ? '' : 'terminal-cursor-blink'
                        }`}
                      />
                    </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        setHistoryIndex(null);
                      }}
                      onKeyDown={onInputKeyDown}
                      aria-label="terminal input"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      className="absolute inset-0 w-full bg-transparent text-transparent caret-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
