import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Terminal } from './Terminal';
import { profile } from '../data/profile';

function setMatchMedia(reduced: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduced && query.includes('reduce'),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

afterEach(() => setMatchMedia(false));

const launcher = () => screen.getByRole('button', { name: /open terminal/i });
const inputEl = () => screen.getByLabelText('terminal input');

async function openTerminal() {
  const user = userEvent.setup();
  render(<Terminal />);
  await user.click(launcher());
  return user;
}

describe('Terminal', () => {
  it('renders a keyboard-focusable launcher', () => {
    render(<Terminal />);
    const btn = launcher();
    btn.focus();
    expect(btn).toHaveFocus();
  });

  it('opens on click and closes on Escape', async () => {
    const user = await openTerminal();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens with Cmd/Ctrl+K', async () => {
    const user = userEvent.setup();
    render(<Terminal />);
    await user.keyboard('{Meta>}k{/Meta}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('prints the command list for help', async () => {
    const user = await openTerminal();
    await user.type(inputEl(), 'help{Enter}');
    expect(screen.getByText('Available commands:')).toBeInTheDocument();
  });

  it('navigates the filesystem with cd and ls', async () => {
    const user = await openTerminal();
    await user.type(inputEl(), 'cd projects{Enter}');
    await user.type(inputEl(), 'ls{Enter}');
    expect(screen.getByText(/netherite-horse-armor-mod\.md/)).toBeInTheDocument();
  });

  it('cats a file derived from the profile', async () => {
    const user = await openTerminal();
    await user.type(inputEl(), 'cat about.txt{Enter}');
    expect(screen.getByText(profile.tagline)).toBeInTheDocument();
  });

  it('reports unknown commands in voice', async () => {
    const user = await openTerminal();
    await user.type(inputEl(), 'notacommand{Enter}');
    expect(screen.getByText(/command not found: notacommand/)).toBeInTheDocument();
  });

  it('restores the previous command with ArrowUp', async () => {
    const user = await openTerminal();
    await user.type(inputEl(), 'help{Enter}');
    await user.keyboard('{ArrowUp}');
    expect(inputEl()).toHaveValue('help');
  });

  it('tab-completes a command', async () => {
    const user = await openTerminal();
    await user.type(inputEl(), 'he');
    await user.keyboard('{Tab}');
    expect(inputEl()).toHaveValue('help ');
  });

  it('calls onThemeToggle exactly once for the theme command', async () => {
    const toggle = vi.fn();
    const user = userEvent.setup();
    render(<Terminal onThemeToggle={toggle} />);
    await user.click(launcher());
    await user.type(inputEl(), 'theme{Enter}');
    expect(toggle).toHaveBeenCalledTimes(1);
  });

  it('omits the blinking cursor animation under reduced motion', async () => {
    setMatchMedia(true);
    const user = userEvent.setup();
    render(<Terminal />);
    await user.click(launcher());
    expect(screen.getByTestId('terminal-cursor').className).not.toContain(
      'terminal-cursor-blink',
    );
  });
});
