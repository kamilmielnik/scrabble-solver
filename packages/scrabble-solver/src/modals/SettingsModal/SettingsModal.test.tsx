import { Game, Locale } from '@scrabble-solver/types';
import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { noop } from '../../lib/noop';
import { settingsInitialState } from '../../state/settings';
import type { RootState } from '../../state/types';
import { setLayout } from '../../test/media';
import { renderWithStore } from '../../test/render';

import { parseValue as parseAutoGroupTiles } from './components/AutoGroupTilesSetting/lib';
import { getOptions } from './components/ConfigSetting/lib';
import { parseValue as parseInputMode } from './components/InputModeSetting/lib';
import { parseValue as parseRemoveCellFilters } from './components/RemoveCellFiltersSetting/lib';
import { SettingsModal } from './SettingsModal';

describe('parsers', () => {
  it('parse valid values', () => {
    expect(parseAutoGroupTiles('left')).toBe('left');
    expect(parseAutoGroupTiles('right')).toBe('right');
    expect(parseAutoGroupTiles('null')).toBeNull();
    expect(parseInputMode('keyboard')).toBe('keyboard');
    expect(parseInputMode('touchscreen')).toBe('touchscreen');
    expect(parseRemoveCellFilters('always')).toBe('always');
    expect(parseRemoveCellFilters('never')).toBe('never');
  });

  it('reject anything else', () => {
    expect(() => parseAutoGroupTiles('up')).toThrow('"up" is not valid');
    expect(() => parseInputMode('voice')).toThrow('"voice" is not valid');
    expect(() => parseRemoveCellFilters('sometimes')).toThrow('"sometimes" is not valid');
  });
});

describe('getOptions', () => {
  it('lists every game and disables those the locale lacks', () => {
    const options = getOptions(Locale.EN_US);
    const kelimelik = options.find(({ value }) => value === Game.Kelimelik);
    const scrabble = options.find(({ value }) => value === Game.Scrabble);

    expect(options.map(({ value }) => value).sort()).toEqual(Object.values(Game).sort());
    expect(kelimelik?.disabled).toBe(true);
    expect(scrabble?.disabled).toBe(false);
  });

  it('prefers the language name of a game', () => {
    const scrabble = getOptions(Locale.PL_PL).find(({ value }) => value === Game.Scrabble);

    expect(scrabble?.label).toContain('Scrabble');
  });
});

describe('SettingsModal', () => {
  it('shows every section', () => {
    setup();

    for (const name of [
      'Game',
      'Language',
      'Coordinates',
      'Input mode',
      'Group remaining tiles',
      'Automatically remove filters from board',
      'Highlight unreachable cells',
    ]) {
      expect(getSection(name)).toBeDefined();
    }
  });

  it('hides input mode on touch devices', () => {
    setLayout({ isCompact: true, isTouch: true });
    setup();

    expect(screen.queryByRole('region', { name: 'Input mode' })).toBeNull();
  });

  it('calls onClose from the close button', () => {
    const { onClose } = setup();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('changes the game and marks it checked', () => {
    const { store } = setup();

    fireEvent.click(getRadio('Game', Game.Crossplay));

    expect(store.getState().settings.game).toBe(Game.Crossplay);
    expect(getRadio('Game', Game.Crossplay).checked).toBe(true);
    expect(getRadio('Game', Game.Scrabble).checked).toBe(false);
  });

  it('disables games the locale does not have', () => {
    setup();

    expect(getRadio('Game', Game.Kelimelik).disabled).toBe(true);
    expect(getRadio('Game', Game.Scrabble).disabled).toBe(false);
  });

  it('changes the language', () => {
    const { store } = setup();

    fireEvent.click(getRadio('Language', Locale.PL_PL));

    expect(store.getState().settings.locale).toBe(Locale.PL_PL);
  });

  it('lists languages sorted by their English name, with flags', () => {
    setup();

    const labels = within(getSection('Language'))
      .getAllByRole('radio')
      .map((radio) => (radio as HTMLInputElement).value);

    expect(labels[0]).toBe(Locale.EN_GB);
    expect(labels).toHaveLength(Object.values(Locale).length);
    expect(getSection('Language').querySelectorAll('[data-icon^="Flag"]')).toHaveLength(Object.values(Locale).length);
  });

  it.each([
    ['Coordinates', 'alternative', 'showCoordinates', 'alternative'],
    ['Input mode', 'touchscreen', 'inputMode', 'touchscreen'],
    ['Group remaining tiles', 'left', 'autoGroupTiles', 'left'],
    ['Group remaining tiles', 'right', 'autoGroupTiles', 'right'],
    ['Automatically remove filters from board', 'never', 'removeCellFilters', 'never'],
    ['Highlight unreachable cells', 'on', 'highlightUnreachableCells', true],
  ] as const)('%s: picks %s', (section, value, key, expected) => {
    const { store } = setup();

    fireEvent.click(getRadio(section, value));

    expect(store.getState().settings[key]).toBe(expected);
    expect(getRadio(section, value).checked).toBe(true);
  });

  it('turns grouping and highlighting back off', () => {
    const { store } = setup({
      settings: { ...settingsInitialState, autoGroupTiles: 'left', highlightUnreachableCells: true },
    });

    fireEvent.click(getRadio('Group remaining tiles', 'null'));
    fireEvent.click(getRadio('Highlight unreachable cells', 'off'));

    expect(store.getState().settings.autoGroupTiles).toBeNull();
    expect(store.getState().settings.highlightUnreachableCells).toBe(false);
  });

  it('switches every radio off while the modal is closing, so a late click cannot change a setting', () => {
    const { rerender } = setup();

    rerender(<SettingsModal isOpen={false} onClose={noop} />);

    for (const radio of screen.getAllByRole('radio', { hidden: true })) {
      expect((radio as HTMLInputElement).disabled).toBe(true);
    }
  });
});

function setup(state: Partial<RootState> = {}) {
  const onClose = mock();

  return { ...renderWithStore(<SettingsModal isOpen onClose={onClose} />, { state }), onClose };
}

function getSection(name: string): HTMLElement {
  return screen.getByRole('region', { name });
}

function getRadio(section: string, value: string): HTMLInputElement {
  return getSection(section).querySelector<HTMLInputElement>(`input[value="${value}"]`)!;
}
