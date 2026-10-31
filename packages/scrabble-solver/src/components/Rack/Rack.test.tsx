/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { BLANK } from '@scrabble-solver/constants';
import { Locale } from '@scrabble-solver/types';
import { act, fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { appSlice } from '../../state/app';
import { hoveredTileSlice } from '../../state/hoveredTile';
import { resultsInitialState } from '../../state/results';
import { settingsInitialState, settingsSlice } from '../../state/settings';
import type { RootState } from '../../state/types';
import { flushEffects } from '../../test/async';
import { createResult } from '../../test/fixtures';
import { renderWithStore } from '../../test/render';

import { Rack } from './Rack';

const emptyRack = Array<string | null>(7).fill(null);
const spanish = { ...settingsInitialState, locale: Locale.ES_ES };
const turkish = { ...settingsInitialState, locale: Locale.TR_TR };
const touchscreen = { ...settingsInitialState, inputMode: 'touchscreen' as const };

describe('rendering', () => {
  it('renders one tile per rack slot', () => {
    setup();

    expect(document.querySelectorAll('input')).toHaveLength(7);
  });

  it('spells the placeholder across empty tiles', () => {
    setup();

    expect(getTileElement(1).textContent).toBe('L');
    expect(getTileElement(2).textContent).toBe('e');
  });

  it('labels tiles with their localized position', () => {
    setup({ rack: ['a'], settings: { ...settingsInitialState, locale: Locale.FA_IR } });

    expect(document.querySelector('input')?.getAttribute('aria-label')).toBe('Rack: tile (۱)');
  });

  it('scores tiles', () => {
    setup({ rack: ['q', ...emptyRack.slice(1)] });

    expect(getTileElement(1).textContent).toBe('q10');
  });

  it('marks letters outside the alphabet as invalid', () => {
    setup({ rack: ['ą', ...emptyRack.slice(1)] });

    expect(getTileElement(1).className).toContain('invalid');
  });

  it('marks blanks', () => {
    setup({ rack: [BLANK, ...emptyRack.slice(1)] });

    expect(getTileElement(1).className).toContain('blank');
  });

  it('autofocuses only the first tile in keyboard mode', () => {
    setup();

    expect(document.activeElement).toBe(getTile(1));
  });

  it('keeps only the first tile in the tab order', () => {
    setup();

    expect(getTile(1).tabIndex).not.toBe(-1);
    expect(getTile(2).tabIndex).toBe(-1);
  });
});

describe('highlighting', () => {
  it('highlights rack tiles used by the previewed result', () => {
    const candidate = createResult({ word: 'at', x: 0, y: 0 });

    setup({
      rack: ['a', 'b', ...emptyRack.slice(2)],
      results: { ...resultsInitialState, candidate },
    });

    expect(getTileElement(1).getAttribute('role')).toBe('mark');
    expect(getTileElement(2).getAttribute('role')).toBeNull();
  });

  /**
   * #91 - Hovering remaining tile highlights all same tiles on the board and rack
   * @see https://github.com/kamilmielnik/scrabble-solver/issues/91
   */
  it('highlights rack tiles matching the hovered character (#91)', () => {
    const { store } = setup({ rack: ['a', 'b', ...emptyRack.slice(2)] });

    act(() => {
      store.dispatch(hoveredTileSlice.actions.set('b'));
    });

    expect(getTileElement(2).getAttribute('role')).toBe('mark');
    expect(getTileElement(1).getAttribute('role')).toBeNull();
  });

  it('does not highlight empty slots', () => {
    setup();

    expect(document.querySelectorAll('[role="mark"]')).toHaveLength(0);
  });
});

describe('typing', () => {
  it('writes a lowercased letter and moves on', () => {
    const { store } = setup();

    type(1, 'A');

    expect(store.getState().rack[0]).toBe('a');
    expect(document.activeElement).toBe(getTile(2));
  });

  it('writes a blank with space', () => {
    const { store } = setup();

    type(1, ' ');

    expect(store.getState().rack[0]).toBe(BLANK);
  });

  /**
   * #3 - "X" tile is allowed in Polish
   * @see https://github.com/kamilmielnik/scrabble-solver/issues/3
   */
  it('ignores a character outside the alphabet and stays (#3)', () => {
    const { store } = setup();

    fireEvent.focus(getTile(3));
    act(() => getTile(3).focus());
    fireEvent.change(getTile(3), { target: { value: '1' } });

    expect(store.getState().rack).toEqual(emptyRack);
    expect(document.activeElement).toBe(getTile(3));
  });

  it('clears the slot and moves back when the input is emptied', () => {
    const { store } = setup({ rack: [null, 'a', ...emptyRack.slice(2)] });

    fireEvent.focus(getTile(2));
    fireEvent.change(getTile(2), { target: { value: '' } });

    expect(store.getState().rack[1]).toBeNull();
    expect(document.activeElement).toBe(getTile(1));
  });

  it('stops at the end of the rack', () => {
    setup();

    type(7, 'a');

    expect(document.activeElement).toBe(getTile(7));
  });

  it('moves on when the same letter is typed over itself', () => {
    setup({ rack: ['a', ...emptyRack.slice(1)] });

    fireEvent.focus(getTile(1));
    fireEvent.keyDown(getTile(1), { key: 'A' });

    expect(document.activeElement).toBe(getTile(2));
  });

  it('moves on when the same letter is typed over itself using the casing rules of the game', () => {
    setup({ rack: ['ı', ...emptyRack.slice(1)], settings: turkish });

    fireEvent.focus(getTile(1));
    fireEvent.keyDown(getTile(1), { key: 'I' });

    expect(document.activeElement).toBe(getTile(2));
  });
});

describe('keyboard navigation', () => {
  it('moves with arrows', () => {
    setup();

    fireEvent.focus(getTile(3));
    fireEvent.keyDown(getTile(3), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(getTile(4));

    fireEvent.keyDown(getTile(4), { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(getTile(3));
  });

  it('mirrors arrows right-to-left', () => {
    setup({ settings: { ...settingsInitialState, locale: Locale.FA_IR } });

    fireEvent.focus(getTile(3));
    fireEvent.keyDown(getTile(3), { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(getTile(4));

    fireEvent.keyDown(getTile(4), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(getTile(3));
  });

  it('stops at the start of the rack', () => {
    setup();

    fireEvent.focus(getTile(1));
    fireEvent.keyDown(getTile(1), { key: 'ArrowLeft' });

    expect(document.activeElement).toBe(getTile(1));
  });

  it('clears and moves back on Backspace', () => {
    const { store } = setup({ rack: [null, 'a', ...emptyRack.slice(2)] });

    fireEvent.focus(getTile(2));
    fireEvent.keyDown(getTile(2), { key: 'Backspace' });

    expect(store.getState().rack[1]).toBeNull();
    expect(document.activeElement).toBe(getTile(1));
  });

  it('clears and moves forward on Delete', () => {
    const { store } = setup({ rack: ['a', ...emptyRack.slice(1)] });

    fireEvent.focus(getTile(1));
    fireEvent.keyDown(getTile(1), { key: 'Delete' });

    expect(store.getState().rack[0]).toBeNull();
    expect(document.activeElement).toBe(getTile(2));
  });

  it('ignores Delete before any tile had focus', () => {
    const { store } = setup({ rack: ['a', ...emptyRack.slice(1)], settings: touchscreen });

    fireEvent.keyDown(getTile(1), { key: 'Delete' });

    expect(store.getState().rack[0]).toBe('a');
  });
});

describe('two-letter tiles', () => {
  it('inserts a digraph with ctrl and its first letter, then moves on', () => {
    const { store } = setup({ settings: spanish });

    fireEvent.focus(getTile(1));
    fireEvent.keyDown(getTile(1), { ctrlKey: true, key: 'c' });

    expect(store.getState().rack[0]).toBe('ch');
    expect(document.activeElement).toBe(getTile(2));
  });

  it('leaves ctrl with another letter to the browser', () => {
    const { store } = setup({ settings: spanish });

    fireEvent.focus(getTile(1));

    expect(fireEvent.keyDown(getTile(1), { ctrlKey: true, key: 'v' })).toBe(true);
    expect(store.getState().rack[0]).toBeNull();
  });

  it('does not insert a digraph without ctrl', () => {
    const { store } = setup({ settings: spanish });

    fireEvent.focus(getTile(1));
    fireEvent.keyDown(getTile(1), { key: 'c' });

    expect(store.getState().rack[0]).toBeNull();
  });
});

describe('pasting', () => {
  it('fills the rack from the focused tile, reading digraphs', () => {
    const { store } = setup({ settings: spanish });

    fireEvent.focus(getTile(2));
    paste('CHAT');

    expect(store.getState().rack.slice(0, 4)).toEqual([null, 'ch', 'a', 't']);
    expect(document.activeElement).toBe(getTile(5));
  });

  it('lower-cases using the casing rules of the game', () => {
    const { store } = setup({ settings: turkish });

    fireEvent.focus(getTile(1));
    paste('KIŞ');

    expect(store.getState().rack.slice(0, 3)).toEqual(['k', 'ı', 'ş']);
  });

  it('never grows the rack', () => {
    const { store } = setup();

    fireEvent.focus(getTile(6));
    paste('abc');

    expect(store.getState().rack).toHaveLength(7);
    expect(store.getState().rack.slice(5)).toEqual(['a', 'b']);
  });

  it('leaves the browser alone before any tile had focus', () => {
    const { store } = setup({ settings: touchscreen });

    paste('abc');

    expect(store.getState().rack).toEqual(emptyRack);
  });

  it('moves back on an empty paste', () => {
    setup();

    fireEvent.focus(getTile(2));
    paste('');

    expect(document.activeElement).toBe(getTile(1));
  });
});

describe('touchscreen input mode', () => {
  it('does not autofocus', () => {
    setup({ settings: touchscreen });

    expect(document.activeElement).toBe(document.body);
  });

  it('drops the focus of the server-rendered autofocus once hydration finds a touch device', () => {
    const { store } = setup();
    expect(document.activeElement).toBe(getTile(1));

    act(() => {
      store.dispatch(settingsSlice.actions.init({ inputMode: 'touchscreen' }));
      store.dispatch(appSlice.actions.hydrated());
    });

    expect(document.activeElement).toBe(document.body);
    expect(document.querySelector('form')).toBeNull();
  });

  it('keeps the autofocus through hydration in keyboard mode', () => {
    const { store } = setup();

    act(() => {
      store.dispatch(appSlice.actions.hydrated());
    });

    expect(document.activeElement).toBe(getTile(1));
  });

  it('opens a prompt prefilled with the rack, uppercasing digraphs', async () => {
    const { store } = setup({
      rack: ['ch', 'a', ...emptyRack.slice(2)],
      settings: { ...touchscreen, locale: Locale.ES_ES },
    });

    openPrompt();
    await flushEffects();

    expect(getPrompt().value).toBe('CHa');
    expect(store.getState().rack[0]).toBe('ch');
    expect(screen.getByTestId('rack').className).toContain('hidden');
  });

  it('keeps default mouse and touch behavior in keyboard mode', () => {
    setup();

    expect(fireEvent.mouseDown(getTile(1))).toBe(true);
    expect(fireEvent.touchStart(getTile(1))).toBe(true);
  });

  it('prevents default mouse and touch behavior', () => {
    setup({ settings: touchscreen });

    expect(fireEvent.mouseDown(getTile(1))).toBe(false);
    expect(fireEvent.touchStart(getTile(1))).toBe(false);
  });

  it('never gives focus to a tile', () => {
    setup({ settings: touchscreen });

    act(() => getTile(2).focus());

    expect(document.activeElement).not.toBe(getTile(2));
  });

  it('writes the whole rack on submit and closes', () => {
    const { store } = setup({ settings: touchscreen });

    openPrompt();
    fireEvent.change(getPrompt(), { target: { value: 'cat' } });
    fireEvent.submit(getPrompt().closest('form')!);

    expect(store.getState().rack).toEqual(['c', 'a', 't', null, null, null, null]);
    expect(screen.queryByPlaceholderText('Letters…')).toBeNull();
  });

  it('reads only uppercase digraphs, so ch stays two tiles', () => {
    const { store } = setup({ settings: { ...touchscreen, locale: Locale.ES_ES } });

    openPrompt();
    fireEvent.change(getPrompt(), { target: { value: 'chCH' } });
    fireEvent.submit(getPrompt().closest('form')!);

    expect(store.getState().rack.slice(0, 3)).toEqual(['c', 'h', 'ch']);
  });

  it('closes on blur without changing the rack', () => {
    const { store } = setup({ settings: touchscreen });

    openPrompt();
    fireEvent.change(getPrompt(), { target: { value: 'cat' } });
    fireEvent.blur(getPrompt());

    expect(store.getState().rack).toEqual(emptyRack);
    expect(screen.queryByPlaceholderText('Letters…')).toBeNull();
  });

  it('closes on a click outside the rack', async () => {
    setup({ settings: touchscreen });

    openPrompt();
    await flushEffects();
    fireEvent.mouseDown(document.body);

    expect(screen.queryByPlaceholderText('Letters…')).toBeNull();
  });
});

function setup(state: Partial<RootState> = {}) {
  return renderWithStore(<Rack />, { state: { rack: emptyRack, ...state } });
}

function getTile(position: number): HTMLInputElement {
  return document.querySelectorAll('input')[position - 1];
}

function getTileElement(position: number): HTMLElement {
  return document.querySelectorAll('input')[position - 1].parentElement!;
}

function getPrompt(): HTMLInputElement {
  return screen.getByPlaceholderText('Letters…');
}

function openPrompt(): void {
  fireEvent.mouseDown(getTile(1));
}

function type(position: number, value: string): void {
  fireEvent.focus(getTile(position));
  fireEvent.change(getTile(position), { target: { value } });
}

function paste(text: string): void {
  fireEvent.paste(getTile(1), { clipboardData: { getData: () => text } });
}
