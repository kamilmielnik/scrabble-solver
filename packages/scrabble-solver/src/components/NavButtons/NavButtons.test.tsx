import { Board, Game, Locale } from '@scrabble-solver/types';
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import english from '../../i18n/languages/english.json';
import { GITHUB_PROJECT_URL } from '../../parameters';
import { settingsInitialState } from '../../state/settings';
import type { RootState } from '../../state/types';
import { verifyInitialState } from '../../state/verify';
import { createVerifiedWord } from '../../test/fixtures';
import { renderWithStore } from '../../test/render';

import { NavButtons } from './NavButtons';

describe('NavButtons', () => {
  it.each([
    ['Clear', 'onClear'],
    ['Remaining tiles', 'onShowRemainingTiles'],
    ['Created words', 'onShowWords'],
    ['Keyboard shortcuts', 'onShowKeyMap'],
    ['Settings', 'onShowSettings'],
    ['Menu', 'onShowMenu'],
  ] as const)('%s calls %s', (name, handler) => {
    const { handlers } = setup();

    fireEvent.click(screen.getByRole('button', { name }));

    expect(handlers[handler]).toHaveBeenCalledTimes(1);
  });

  it('links to the project', () => {
    setup();

    const link = screen.getByRole('link', { name: english.github });

    expect(link.getAttribute('href')).toBe(GITHUB_PROJECT_URL);
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('hides remaining tiles for games without tile counts', () => {
    setup({ settings: { ...settingsInitialState, game: Game.LetterLeague, locale: Locale.EN_US } });

    expect(screen.queryByRole('button', { name: 'Remaining tiles' })).toBeNull();
  });

  it('flags invalid words on the board', () => {
    setup({ verify: { ...verifyInitialState, invalidWords: [createVerifiedWord({ isValid: false })] } });

    expect(screen.getByRole('button', { name: 'Created words' }).className).toContain('error');
  });

  it('does not flag valid boards', () => {
    setup();

    expect(screen.getByRole('button', { name: 'Created words' }).className).not.toContain('error');
    expect(screen.getByRole('button', { name: 'Remaining tiles' }).className).not.toContain('error');
  });

  it('flags tiles used more often than the game has them', () => {
    setup({ rack: ['q', 'q'] });

    expect(screen.getByRole('button', { name: 'Remaining tiles' }).className).toContain('error');
  });

  it('counts tiles on the board too', () => {
    setup({ board: Board.fromStringArray(['qq']), rack: ['q'] });

    expect(screen.getByRole('button', { name: 'Remaining tiles' }).className).toContain('error');
  });
});

function setup(state: Partial<RootState> = {}) {
  const handlers = {
    onClear: mock(),
    onShowKeyMap: mock(),
    onShowMenu: mock(),
    onShowRemainingTiles: mock(),
    onShowSettings: mock(),
    onShowWords: mock(),
  };

  return { ...renderWithStore(<NavButtons {...handlers} />, { state }), handlers };
}
