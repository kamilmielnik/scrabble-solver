/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { BLANK } from '@scrabble-solver/constants';
import { Board, Locale } from '@scrabble-solver/types';
import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import english from '../i18n/languages/english.json';
import { noop } from '../lib/noop';
import { GITHUB_PROJECT_URL } from '../parameters';
import { hoveredTileSlice } from '../state/hoveredTile';
import { settingsInitialState } from '../state/settings';
import type { RootState } from '../state/types';
import { setViewport } from '../test/media';
import { renderWithStore } from '../test/render';
import { type RemainingTile } from '../types';

import { DictionaryModal } from './DictionaryModal';
import { KeyMapModal } from './KeyMapModal';
import { Mapping } from './KeyMapModal/components';
import { MenuModal } from './MenuModal';
import { RemainingTilesModal } from './RemainingTilesModal';
import { getRemainingTilesGroups } from './RemainingTilesModal/lib';

const spanish = { settings: { ...settingsInitialState, locale: Locale.ES_ES } };
const persian = { settings: { ...settingsInitialState, locale: Locale.FA_IR } };

describe('DictionaryModal', () => {
  it('shows the dictionary and its search input', () => {
    renderWithStore(<DictionaryModal isOpen onClose={noop} />);

    expect(screen.getByRole('dialog', { name: 'Dictionary' })).toBeDefined();
    expect(screen.getByRole('textbox')).toBeDefined();
    expect(screen.getByText(english['dictionary.empty-state.uninitialized'])).toBeDefined();
  });

  it('closes', () => {
    const onClose = mock();

    renderWithStore(<DictionaryModal isOpen onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('KeyMapModal', () => {
  it('documents shortcuts by section', () => {
    renderWithStore(<KeyMapModal isOpen onClose={noop} />);

    expect(screen.getByRole('region', { name: english['keyMap.board-and-rack'] })).toBeDefined();
    expect(screen.getByRole('region', { name: english['keyMap.board'] })).toBeDefined();
    expect(screen.getByRole('region', { name: english['keyMap.rack'] })).toBeDefined();
  });

  it('hides the two-letter tile shortcut for languages without them', () => {
    renderWithStore(<KeyMapModal isOpen onClose={noop} />);

    expect(screen.queryByText(english['keyMap.board-and-rack.insert-two-letter-tile'])).toBeNull();
  });

  it('lists the first letters of two-letter tiles', () => {
    renderWithStore(<KeyMapModal isOpen onClose={noop} />, { state: spanish });

    const section = screen.getByRole('region', { name: english['keyMap.board-and-rack'] });
    const mapping = within(section).getByText(english['keyMap.board-and-rack.insert-two-letter-tile']).parentElement!;

    expect(mapping.textContent).toContain('C');
    expect(mapping.textContent).toContain('L');
    expect(mapping.textContent).toContain('R');
  });
});

describe('Mapping', () => {
  it('joins alternatives with a slash', () => {
    const { container } = renderWithStore(<Mapping description="Do" mapping={['A', 'B']} />);

    expect(container.querySelector('.keys')?.textContent).toBe('A/B');
  });

  it('joins a combination with a plus', () => {
    const { container } = renderWithStore(<Mapping description="Do" mapping={[['Ctrl', 'G']]} />);

    expect(container.querySelector('.keys')?.textContent).toBe('Ctrl+G');
  });

  it('adds no slash for a single key', () => {
    const { container } = renderWithStore(<Mapping description="Do" mapping={['A']} />);

    expect(container.querySelector('.slash')).toBeNull();
  });
});

describe('MenuModal', () => {
  it.each([
    [english['remaining-tiles'], 'onShowRemainingTiles'],
    [english.words, 'onShowWords'],
    [english.dictionary, 'onShowDictionary'],
    [english.settings, 'onShowSettings'],
  ] as const)('%s calls %s', (name, handler) => {
    const handlers = setupMenu();

    fireEvent.click(screen.getByRole('button', { name }));

    expect(handlers[handler]).toHaveBeenCalledTimes(1);
  });

  it('links to the project', () => {
    setupMenu();

    expect(screen.getByRole('link', { name: english.github }).getAttribute('href')).toBe(GITHUB_PROJECT_URL);
  });

  it('shows the flag of the active language on the settings button', () => {
    renderWithStore(<MenuModal {...createMenuHandlers()} isOpen />, { state: persian });

    expect(document.querySelector('[data-icon="FlagFa.svg"]')).not.toBeNull();
  });
});

describe('getRemainingTilesGroups', () => {
  it('splits tiles into vowels, consonants and blanks, dropping empty groups', () => {
    const groups = getRemainingTilesGroups(
      [
        createTile({ character: 'a', count: 9, usedCount: 2 }),
        createTile({ character: 'b', count: 2, usedCount: 1 }),
        createTile({ character: BLANK, count: 2, usedCount: 0 }),
      ],
      Locale.EN_US,
    );

    expect(groups.map(({ translationKey }) => translationKey)).toEqual([
      'common.vowels',
      'common.consonants',
      'common.blanks',
    ]);
    expect(groups[0]).toMatchObject({ remainingCount: 7, totalCount: 9 });
    expect(groups[1]).toMatchObject({ remainingCount: 1, totalCount: 2 });
  });

  it('groups digraphs and other letters', () => {
    const groups = getRemainingTilesGroups(
      [createTile({ character: 'ch', count: 1 }), createTile({ character: 'ش', count: 3 })],
      Locale.EN_US,
    );

    expect(groups.map(({ translationKey }) => translationKey)).toEqual(['common.tiles', 'common.two-letter-tiles']);
  });

  it('ignores tiles without a count', () => {
    const groups = getRemainingTilesGroups(
      [createTile({ character: 'a', count: undefined, usedCount: 1 }), createTile({ character: 'e', count: 1 })],
      Locale.EN_US,
    );

    expect(groups[0]).toMatchObject({ remainingCount: 1, totalCount: 1 });
  });

  it('counts overuse as a negative remainder', () => {
    const [group] = getRemainingTilesGroups([createTile({ character: 'a', count: 1, usedCount: 3 })], Locale.EN_US);

    expect(group.remainingCount).toBe(-2);
  });

  it('leaves out a letter outside the alphabet, which has no tiles in the bag', () => {
    const groups = getRemainingTilesGroups(
      [createTile({ character: 'ą', count: 0, usedCount: 1 }), createTile({ character: 'a', count: 9 })],
      Locale.EN_US,
    );

    expect(groups.map(({ remainingCount }) => remainingCount)).toEqual([9]);
  });

  it('groups y with the consonants in Turkish and with the vowels elsewhere', () => {
    const tiles = [createTile({ character: 'y', count: 2 }), createTile({ character: 'k', count: 7 })];
    const inTurkish = getRemainingTilesGroups(tiles, Locale.TR_TR);
    const inEnglish = getRemainingTilesGroups(tiles, Locale.EN_US);

    expect(inTurkish.map(({ totalCount }) => totalCount)).toEqual([9]);
    expect(inEnglish.map(({ totalCount }) => totalCount)).toEqual([2, 7]);
  });
});

describe('RemainingTilesModal', () => {
  it('shows sections with remaining and total counts', () => {
    setupRemaining({ board: Board.fromStringArray(['a ']), rack: ['a'] });

    const vowels = screen.getByRole('region', { name: 'Vowels' });

    expect(vowels.querySelector('.badge')?.textContent).toBe('42 / 44');
    expect(screen.getByTestId('remaining-tile-a').textContent).toContain('7 / 9');
  });

  it('swaps the fraction in right-to-left locales', () => {
    setupRemaining({ ...persian, rack: [] });

    const tile = document.querySelector('[data-testid^="remaining-tile-"]:not([data-testid$="blank"])')!;
    const [left, right] = tile.querySelector('.count')!.textContent!.split(' / ');

    expect(left).toBe(right);
  });

  it('keeps the numerator on the left in LTR and on the right in RTL once tiles are used', () => {
    setupRemaining({ ...persian, board: Board.fromStringArray(['ا ']), rack: [] });

    const count = screen.getByTestId('remaining-tile-ا').querySelector('.count')?.textContent;
    const [left, right] = count!.split(' / ').map(toLatinDigits);

    expect(Number(left)).toBeGreaterThan(Number(right));
  });

  it('marks finished and overused tiles', () => {
    setupRemaining({ rack: ['q', 'q'] });

    const className = screen.getByTestId('remaining-tile-q').className;

    expect(className).toContain('finished');
    expect(className).toContain('overused');
  });

  it('marks untouched tiles', () => {
    setupRemaining();

    expect(screen.getByTestId('remaining-tile-q').className).toContain('unused');
  });

  it('finds the blank by a readable test id', () => {
    setupRemaining();

    expect(screen.getByTestId('remaining-tile-blank')).toBeDefined();
  });

  /**
   * #91 - Hovering remaining tile highlights all same tiles on the board and rack
   * @see https://github.com/kamilmielnik/scrabble-solver/issues/91
   */
  it('highlights a used tile on hover and clears when leaving (#91)', () => {
    const { store } = setupRemaining({ rack: ['a'] });
    const tile = screen.getByTestId('remaining-tile-a');

    fireEvent.mouseEnter(tile);
    expect(store.getState().hoveredTile.character).toBe('a');
    expect(tile.querySelector('[role="mark"]')).not.toBeNull();

    fireEvent.mouseLeave(tile);
    expect(store.getState().hoveredTile.character).toBeNull();
  });

  /**
   * #91 - Hovering remaining tile highlights all same tiles on the board and rack
   * @see https://github.com/kamilmielnik/scrabble-solver/issues/91
   */
  it('does not highlight unused tiles (#91)', () => {
    const { store } = setupRemaining();

    fireEvent.mouseEnter(screen.getByTestId('remaining-tile-a'));

    expect(store.getState().hoveredTile.character).toBeNull();
  });

  /**
   * #91 - Hovering remaining tile highlights all same tiles on the board and rack
   * @see https://github.com/kamilmielnik/scrabble-solver/issues/91
   */
  it('does not highlight when the modal covers the board anyway (#91)', () => {
    setViewport({ width: 400 });
    const { store } = setupRemaining({ rack: ['a'] });

    fireEvent.mouseEnter(screen.getByTestId('remaining-tile-a'));

    expect(store.getState().hoveredTile.character).toBeNull();
  });

  it('clears the hovered tile when unmounted', () => {
    const { store, unmount } = setupRemaining({ rack: ['a'] });

    store.dispatch(hoveredTileSlice.actions.set('a'));
    unmount();

    expect(store.getState().hoveredTile.character).toBeNull();
  });

  it('refuses a config without tile counts', async () => {
    const { Character } = await import('./RemainingTilesModal/components');
    const tile = createTile({ character: 'a', count: undefined });

    expect(() => renderWithStore(<Character canHighlight tile={tile} />)).toThrow(
      'Remaining tiles not supported for this config',
    );
  });
});

function createMenuHandlers() {
  return {
    onClose: mock(),
    onShowDictionary: mock(),
    onShowRemainingTiles: mock(),
    onShowSettings: mock(),
    onShowWords: mock(),
  };
}

function setupMenu() {
  const handlers = createMenuHandlers();

  renderWithStore(<MenuModal {...handlers} isOpen />);

  return handlers;
}

function setupRemaining(state: Partial<RootState> = {}) {
  return renderWithStore(<RemainingTilesModal isOpen onClose={noop} />, {
    state: { rack: [], ...state },
  });
}

function createTile(overrides: Partial<RemainingTile> & { character: string }): RemainingTile {
  return { count: 1, score: 1, usedCount: 0, ...overrides };
}

function toLatinDigits(value: string): string {
  return value.replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));
}
