/* eslint-disable max-lines */

import { type Action } from '@reduxjs/toolkit';
import { getConfig } from '@scrabble-solver/configs';
import { Board as BoardModel, Game, Locale } from '@scrabble-solver/types';
import { act, fireEvent, screen } from '@testing-library/react';

import english from '../../i18n/languages/english.json';
import { boardSlice } from '../../state/board';
import { cellFiltersSlice } from '../../state/cellFilters';
import { hoveredTileSlice } from '../../state/hoveredTile';
import { resultsInitialState, resultsSlice } from '../../state/results';
import { settingsInitialState, settingsSlice } from '../../state/settings';
import { solveInitialState } from '../../state/solve';
import type { RootState } from '../../state/types';
import { verifyInitialState } from '../../state/verify';
import { flushEffects } from '../../test/async';
import { createResult, createVerifiedWord } from '../../test/fixtures';
import { setLayout } from '../../test/media';
import { renderWithStore } from '../../test/render';
import { type TestStore } from '../../test/store';

import { Board } from './Board';

describe('rendering', () => {
  it('renders one cell per board square', () => {
    setup();

    expect(document.querySelectorAll('input')).toHaveLength(225);
  });

  it('labels columns with letters and rows with numbers by default', () => {
    setup();

    expect(readCoordinates().slice(0, 3)).toEqual(['A', 'B', 'C']);
    expect(screen.getByLabelText('Board: tile O15')).toBeDefined();
  });

  it('swaps letters and numbers in alternative mode', () => {
    setup({ settings: { ...settingsInitialState, showCoordinates: 'alternative' } });

    expect(readCoordinates().slice(0, 3)).toEqual(['1', '2', '3']);
    expect(screen.getByLabelText('Board: tile 15O')).toBeDefined();
  });

  it('shows tiles with their points', () => {
    setup({ board: createBoard({ 0: 'a' }) });

    expect(getCell('A1').value).toBe('a');
    expect(getCell('A1').parentElement?.textContent).toBe('a1');
  });

  it('applies the board background', () => {
    setup();

    expect(screen.getByTestId('board').style.backgroundImage).toContain('data:image/svg+xml');
  });

  it('sizes to the game', () => {
    setup({
      board: BoardModel.create(21, 21),
      settings: { ...settingsInitialState, game: Game.SuperScrabble },
    });

    expect(document.querySelectorAll('input')).toHaveLength(21 * 21);
  });

  it('marks tiles outside the active alphabet as invalid', () => {
    setup({ board: createBoard({ 0: 'ą' }) });

    expect(getCell('A1').parentElement?.className).toContain('invalid');
  });

  it('shows the candidate cells', () => {
    const candidate = createResult({ word: 'at', x: 0, y: 0 });

    setup({ results: { ...resultsInitialState, candidate } });

    expect(getCell('A1').value).toBe('a');
    expect(getCell('A1').parentElement?.getAttribute('role')).toBe('mark');
  });
});

describe('highlighting', () => {
  it('does not highlight anything by default', () => {
    setup({ board: createBoard({ 0: 'a' }) });

    expect(document.querySelectorAll('[role="mark"]')).toHaveLength(0);
  });

  it('highlights tiles of the hovered character only', () => {
    const { store } = setup({ board: createBoard({ 0: 'a', 1: 'b' }) });

    dispatch(store, hoveredTileSlice.actions.set('a'));

    expect(getCell('A1').parentElement?.getAttribute('role')).toBe('mark');
    expect(getCell('B1').parentElement?.getAttribute('role')).toBeNull();
  });

  it('does not highlight a blank played as the hovered letter', () => {
    const board = createBoard({ 0: 'a' });
    board.rows[0][0].tile.isBlank = true;

    const { store } = setup({ board });

    dispatch(store, hoveredTileSlice.actions.set('a'));

    expect(document.querySelectorAll('[role="mark"]')).toHaveLength(0);
  });

  it('highlights played blanks when the blank tile is hovered', () => {
    const board = createBoard({ 0: 'a', 1: 'b' });
    board.rows[0][0].tile.isBlank = true;

    const { store } = setup({ board });

    dispatch(store, hoveredTileSlice.actions.set(' '));

    expect(document.querySelectorAll('[role="mark"]')).toHaveLength(1);
    expect(getCell('A1').parentElement?.getAttribute('role')).toBe('mark');
  });

  it('highlights the cells of the hovered word', () => {
    const board = createBoard({ 0: 'a', 1: 't' });

    setup({
      board,
      hoveredWord: { word: createVerifiedWord({ word: 'at', x: 0, y: 0 }) },
      verify: { ...verifyInitialState, lastSolvedParameters: { board } },
    });

    expect(document.querySelectorAll('[role="mark"]')).toHaveLength(2);
  });

  it('combines every highlight source', () => {
    const board = createBoard({ 0: 'a', 1: 't', 5: 'x' });
    const candidate = createResult({ word: 'q', x: 9, y: 9 });

    const { store } = setup({
      board,
      hoveredWord: { word: createVerifiedWord({ word: 'at', x: 0, y: 0 }) },
      results: { ...resultsInitialState, candidate },
      verify: { ...verifyInitialState, lastSolvedParameters: { board } },
    });

    dispatch(store, hoveredTileSlice.actions.set('x'));

    expect(document.querySelectorAll('[role="mark"]')).toHaveLength(4);
  });

  it('dims unreachable cells when the setting is on', () => {
    setup({
      board: createBoard({ 112: 'a' }),
      rack: ['a'],
      settings: { ...settingsInitialState, highlightUnreachableCells: true },
    });

    expect(getCell('A1').parentElement?.className).toContain('unreachable');
    expect(getCell('H7').parentElement?.className).not.toContain('unreachable');
  });
});

describe('cell filters', () => {
  it('shows a flag on an included cell and a ban on an excluded one', () => {
    setup({
      cellFilters: [
        { type: 'include', x: 1, y: 2 },
        { type: 'exclude', x: 3, y: 4 },
      ],
    });

    const icons = Array.from(document.querySelectorAll('.iconContainer svg')).map((icon) => {
      return icon.getAttribute('data-icon');
    });

    expect(icons).toEqual(['FlagFill.svg', 'Ban.svg']);
  });

  it('positions filter icons from the left in LTR', () => {
    setup({ cellFilters: [{ type: 'include', x: 1, y: 2 }] });

    const icon = document.querySelector<HTMLElement>('.iconContainer');

    expect(icon?.style.left).toContain('1 *');
    expect(icon?.style.right).toBe('');
  });

  it('positions filter icons from the right in RTL', () => {
    setup({
      cellFilters: [{ type: 'include', x: 1, y: 2 }],
      settings: { ...settingsInitialState, locale: Locale.FA_IR },
    });

    const icon = document.querySelector<HTMLElement>('.iconContainer');

    expect(icon?.style.right).toContain('1 *');
    expect(icon?.style.left).toBe('');
  });
});

describe('typing', () => {
  it('writes a letter and moves right', () => {
    const { store } = setup();

    type('A1', 'a');

    expect(readBoard(store, 0, 0)).toBe('a');
    expect(document.activeElement).toBe(getCell('B1'));
  });

  it('moves down in vertical mode', () => {
    setup();

    press('A1', 'ArrowDown');
    type('A1', 'a');

    expect(document.activeElement).toBe(getCell('A2'));
  });

  it('does not walk off the board', () => {
    setup();

    fireEvent.focus(getCell('O1'));
    type('O1', 'a');

    expect(document.activeElement).toBe(getCell('O1'));
  });

  it('ignores characters outside the alphabet', () => {
    const { store } = setup();

    type('A1', '1');

    expect(readBoard(store, 0, 0)).toBe(' ');
  });

  it('clears the cell and moves back when the input is emptied', () => {
    const { store } = setup({ board: createBoard({ 1: 'a' }) });

    fireEvent.focus(getCell('B1'));
    fireEvent.change(getCell('B1'), { target: { value: '' } });

    expect(readBoard(store, 1, 0)).toBe(' ');
    expect(document.activeElement).toBe(getCell('A1'));
  });

  it('toggles blank when space replaces a tile', () => {
    const { store } = setup({ board: createBoard({ 0: 'a' }) });

    fireEvent.change(getCell('A1'), { target: { value: ' ' } });

    expect(store.getState().board.rows[0][0].tile.isBlank).toBe(true);
    expect(readBoard(store, 0, 0)).toBe('a');
  });

  it('keeps moving when the same letter is typed over itself', () => {
    setup({ board: createBoard({ 0: 'a' }) });

    fireEvent.focus(getCell('A1'));
    press('A1', 'a');

    expect(document.activeElement).toBe(getCell('B1'));
  });

  it('does not move on a different key press, leaving it to the change event', () => {
    setup({ board: createBoard({ 0: 'a' }) });

    focus('A1');
    press('A1', 'b');

    expect(document.activeElement).toBe(getCell('A1'));
  });
});

describe('keyboard navigation', () => {
  it('moves right and left along a horizontal line', () => {
    setup();

    fireEvent.focus(getCell('C3'));
    press('C3', 'ArrowRight');
    expect(document.activeElement).toBe(getCell('D3'));

    press('D3', 'ArrowLeft');
    expect(document.activeElement).toBe(getCell('C3'));
  });

  it('turns vertical on the first ArrowDown without moving, then moves', () => {
    setup();

    fireEvent.focus(getCell('C3'));
    focus('C3');
    press('C3', 'ArrowDown');
    expect(document.activeElement).toBe(getCell('C3'));

    press('C3', 'ArrowDown');
    expect(document.activeElement).toBe(getCell('C4'));
  });

  it('turns vertical and moves on ArrowUp', () => {
    setup();

    fireEvent.focus(getCell('C3'));
    press('C3', 'ArrowUp');

    expect(document.activeElement).toBe(getCell('C2'));
    expect(screen.queryByTestId('toggle-direction-button')?.getAttribute('data-direction')).toBe('vertical');
  });

  it('turns horizontal without moving on ArrowRight', () => {
    setup();

    fireEvent.focus(getCell('C3'));
    focus('C3');
    press('C3', 'ArrowDown');
    press('C3', 'ArrowRight');

    expect(document.activeElement).toBe(getCell('C3'));
    expect(screen.queryByTestId('toggle-direction-button')?.getAttribute('data-direction')).toBe('horizontal');
  });

  it('turns horizontal and moves back on ArrowLeft', () => {
    setup();

    fireEvent.focus(getCell('C3'));
    press('C3', 'ArrowDown');
    press('C3', 'ArrowLeft');

    expect(document.activeElement).toBe(getCell('B3'));
  });

  it('stops at the edges', () => {
    setup();

    fireEvent.focus(getCell('A1'));
    focus('A1');
    press('A1', 'ArrowLeft');
    expect(document.activeElement).toBe(getCell('A1'));

    press('A1', 'ArrowUp');
    expect(document.activeElement).toBe(getCell('A1'));
  });

  describe('right-to-left', () => {
    const settings = { ...settingsInitialState, locale: Locale.FA_IR };

    it('mirrors the left and right arrows', () => {
      setup({ settings });

      fireEvent.focus(getCell('C3'));
      press('C3', 'ArrowLeft');
      expect(document.activeElement).toBe(getCell('D3'));

      press('D3', 'ArrowRight');
      expect(document.activeElement).toBe(getCell('C3'));
    });

    it('turns horizontal without moving on ArrowLeft', () => {
      setup({ settings });

      fireEvent.focus(getCell('C3'));
      focus('C3');
      press('C3', 'ArrowDown');
      press('C3', 'ArrowLeft');

      expect(document.activeElement).toBe(getCell('C3'));
    });

    it('turns horizontal and moves back on ArrowRight', () => {
      setup({ settings });

      fireEvent.focus(getCell('C3'));
      press('C3', 'ArrowDown');
      press('C3', 'ArrowRight');

      expect(document.activeElement).toBe(getCell('B3'));
    });
  });

  it('prevents the default scroll of arrow keys', () => {
    setup();

    for (const key of ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']) {
      expect(fireEvent.keyDown(getCell('C3'), { key })).toBe(false);
    }
  });
});

describe('removing tiles', () => {
  it('clears and moves back on Backspace', () => {
    const { store } = setup({ board: createBoard({ 1: 'a' }) });

    fireEvent.focus(getCell('B1'));
    press('B1', 'Backspace');

    expect(readBoard(store, 1, 0)).toBe(' ');
    expect(document.activeElement).toBe(getCell('A1'));
  });

  it('clears and moves forward on Delete', () => {
    const { store } = setup({ board: createBoard({ 1: 'a' }) });

    fireEvent.focus(getCell('B1'));
    press('B1', 'Delete');

    expect(readBoard(store, 1, 0)).toBe(' ');
    expect(document.activeElement).toBe(getCell('C1'));
  });
});

describe('blank and filter keys', () => {
  it('toggles blank with space', () => {
    const { store } = setup({ board: createBoard({ 0: 'a' }) });

    press('A1', ' ');

    expect(store.getState().board.rows[0][0].tile.isBlank).toBe(true);
  });

  it('toggles a cell filter with ctrl+g on an empty cell', () => {
    const { store } = setup();

    press('A1', 'g', { ctrlKey: true });

    expect(store.getState().cellFilters).toEqual([{ type: 'include', x: 0, y: 0 }]);
  });

  it('toggles a cell filter with cmd+g', () => {
    const { store } = setup();

    press('A1', 'g', { metaKey: true });

    expect(store.getState().cellFilters).toHaveLength(1);
  });

  it('does not filter a cell that has a tile', () => {
    const { store } = setup({ board: createBoard({ 0: 'a' }) });

    press('A1', 'g', { ctrlKey: true });

    expect(store.getState().cellFilters).toEqual([]);
  });
});

describe('two-letter tiles', () => {
  const settings = { ...settingsInitialState, locale: Locale.ES_ES };

  it('inserts the digraph with ctrl and its first letter', () => {
    const { store } = setup({ settings });

    fireEvent.focus(getCell('A1'));
    press('A1', 'c', { ctrlKey: true });

    expect(readBoard(store, 0, 0)).toBe('ch');
    expect(document.activeElement).toBe(getCell('B1'));
  });

  it('joins a typed letter into the current cell', () => {
    const { store } = setup({ board: createBoard({ 0: 'c' }), settings });

    fireEvent.focus(getCell('A1'));
    press('A1', 'h');

    expect(readBoard(store, 0, 0)).toBe('ch');
    expect(document.activeElement).toBe(getCell('B1'));
  });

  it('joins with the tile on the left when typing', () => {
    const { store } = setup({ board: createBoard({ 0: 'c' }), settings });

    type('B1', 'h');

    expect(readBoard(store, 0, 0)).toBe('ch');
    expect(readBoard(store, 1, 0)).toBe(' ');
  });

  it('joins with the tile on the right when typing, leaving the digraph split for the next step', () => {
    const { store } = setup({ board: createBoard({ 1: 'h' }), settings });

    type('A1', 'c');

    expect(readBoard(store, 0, 0)).toBe('c');
    expect(readBoard(store, 1, 0)).toBe(' ');
  });

  it('joins with the tile above when typing', () => {
    const { store } = setup({ board: createBoard({ 15: 'c' }), settings });

    type('A3', 'h');

    expect(readBoard(store, 0, 1)).toBe('ch');
    expect(readBoard(store, 0, 2)).toBe(' ');
  });

  it('joins with a tile in the first row when typing in the second row', () => {
    const { store } = setup({ board: createBoard({ 0: 'c' }), settings });

    type('A2', 'h');

    expect(readBoard(store, 0, 0)).toBe('ch');
    expect(readBoard(store, 0, 1)).toBe(' ');
  });

  it('joins with the tile below when typing', () => {
    const { store } = setup({ board: createBoard({ 15: 'h' }), settings });

    type('A1', 'c');

    expect(readBoard(store, 0, 0)).toBe('c');
    expect(readBoard(store, 0, 1)).toBe(' ');
  });

  it('does not join with a blank tile', () => {
    const board = createBoard({ 0: 'c' });
    board.rows[0][0].tile.isBlank = true;

    const { store } = setup({ board, settings });

    type('B1', 'h');

    expect(readBoard(store, 0, 0)).toBe('c');
    expect(readBoard(store, 1, 0)).toBe('h');
  });

  it('joins inside the same cell at the last column', () => {
    const { store } = setup({ board: createBoard({ 14: 'c' }), settings });

    fireEvent.focus(getCell('O1'));
    paste('O1', 'h');

    expect(readBoard(store, 14, 0)).toBe('ch');
  });

  it('pastes a word as digraphs', () => {
    const { store } = setup({ settings });

    paste('A1', 'CHALLA');

    expect(readRow(store, 0).slice(0, 4)).toEqual(['ch', 'a', 'll', 'a']);
  });
});

describe('pasting', () => {
  it('writes letters along the current direction, lowercased', () => {
    const { store } = setup();

    paste('A1', 'CAT');

    expect(readRow(store, 0).slice(0, 3)).toEqual(['c', 'a', 't']);
    expect(document.activeElement).toBe(getCell('D1'));
  });

  it('writes downwards in vertical mode', () => {
    const { store } = setup();

    fireEvent.focus(getCell('A1'));
    press('A1', 'ArrowDown');
    paste('A1', 'cat');

    expect(readBoard(store, 0, 1)).toBe('a');
    expect(readBoard(store, 0, 2)).toBe('t');
  });

  it('drops what does not fit on the board', () => {
    const { store } = setup();

    paste('N1', 'cat');

    expect(readBoard(store, 13, 0)).toBe('c');
    expect(readBoard(store, 14, 0)).toBe('a');
    expect(store.getState().board.getTilesCount()).toBe(2);
  });

  it('skips spaces in pasted text', () => {
    const { store } = setup();

    paste('A1', 'a b');

    expect(readRow(store, 0).slice(0, 2)).toEqual(['a', 'b']);
  });

  it('clears the cell for an empty paste', () => {
    const { store } = setup({ board: createBoard({ 0: 'a' }) });

    paste('A1', '');

    expect(readBoard(store, 0, 0)).toBe(' ');
  });
});

describe('focus and floating actions', () => {
  it('shows no actions before focus', () => {
    setup();

    expect(screen.queryByLabelText('Toggle direction')).toBeNull();
  });

  it('shows direction and filter actions on an empty cell in keyboard mode', () => {
    setup();

    fireEvent.focus(getCell('A1'));

    expect(screen.getByTestId('toggle-direction-button')).toBeDefined();
    expect(screen.getByLabelText(englishLabel('cell.filter-cell.include'))).toBeDefined();
    expect(screen.queryByLabelText(englishLabel('cell.enter-word'))).toBeNull();
  });

  it('offers to set blank on a filled cell', () => {
    setup({ board: createBoard({ 0: 'a' }) });

    fireEvent.focus(getCell('A1'));
    fireEvent.click(screen.getByLabelText(englishLabel('cell.set-blank')));

    expect(screen.getByLabelText(englishLabel('cell.set-not-blank'))).toBeDefined();
  });

  it('toggles a filter from the actions and returns focus in keyboard mode', () => {
    const { store } = setup();

    fireEvent.focus(getCell('A1'));
    fireEvent.click(screen.getByLabelText(englishLabel('cell.filter-cell.include')));

    expect(store.getState().cellFilters).toMatchObject([{ type: 'include', x: 0, y: 0 }]);
    expect(document.activeElement).toBe(getCell('A1'));
    expect(screen.getByLabelText(englishLabel('cell.filter-cell.exclude'))).toBeDefined();
  });

  it('toggles direction from the actions', () => {
    setup();

    fireEvent.focus(getCell('A1'));
    fireEvent.click(screen.getByTestId('toggle-direction-button'));

    expect(screen.getByTestId('toggle-direction-button').getAttribute('data-direction')).toBe('vertical');
    expect(document.activeElement).toBe(getCell('A1'));
  });

  it('keeps actions open when focus stays inside the board', () => {
    setup();

    fireEvent.focus(getCell('A1'));
    fireEvent.blur(getCell('A1'), { relatedTarget: getCell('B1') });

    expect(screen.getByTestId('toggle-direction-button')).toBeDefined();
  });

  it('closes actions when focus leaves the board', () => {
    setup();

    fireEvent.focus(getCell('A1'));
    fireEvent.blur(getCell('A1'), { relatedTarget: document.body });

    expect(screen.queryByTestId('toggle-direction-button')).toBeNull();
  });

  it('closes actions on a click outside', async () => {
    setup();

    fireEvent.focus(getCell('A1'));
    await flushEffects();
    fireEvent.mouseDown(document.body);

    expect(screen.queryByTestId('toggle-direction-button')).toBeNull();
  });

  it('keeps the active cell inside a smaller board after the game changes', () => {
    const { store } = setup({
      board: BoardModel.create(21, 21),
      settings: { ...settingsInitialState, game: Game.SuperScrabble },
    });

    fireEvent.focus(getCell('U21'));
    dispatch(store, settingsSlice.actions.changeGame(Game.Scrabble));

    expect(screen.getByTestId('toggle-direction-button')).toBeDefined();
    expect(document.querySelectorAll('input')).toHaveLength(225);
  });
});

describe('touchscreen input mode', () => {
  const settings = { ...settingsInitialState, inputMode: 'touchscreen' as const };

  it('blurs the input instead of opening the keyboard, but selects the cell', () => {
    setup({ settings });

    focus('A1');

    expect(document.activeElement).not.toBe(getCell('A1'));
    expect(screen.getByLabelText(englishLabel('cell.enter-word'))).toBeDefined();
  });

  it('prevents the default mouse and touch behavior', () => {
    setup({ settings });

    expect(fireEvent.mouseDown(getCell('A1'))).toBe(false);
    expect(fireEvent.touchStart(getCell('A1'))).toBe(false);
  });

  it('keeps default mouse and touch behavior in keyboard mode', () => {
    setup();

    expect(fireEvent.mouseDown(getCell('A1'))).toBe(true);
    expect(fireEvent.touchStart(getCell('A1'))).toBe(true);
  });

  it('enters a word through the prompt, lowercased, then solves', () => {
    const { store } = setup({ settings });

    openPrompt();
    fireEvent.change(screen.getByPlaceholderText('Letters'), { target: { value: 'CAT' } });
    fireEvent.click(screen.getByLabelText(englishLabel('results.insert')));

    expect(readRow(store, 0).slice(0, 3)).toEqual(['c', 'a', 't']);
    expect(store.getState().solve.isLoading).toBe(true);
    expect(screen.queryByPlaceholderText('Letters')).toBeNull();
  });

  it('prefills the prompt with the tile of the cell', () => {
    setup({ board: createBoard({ 0: 'a' }), settings });

    openPrompt();

    expect((screen.getByPlaceholderText('Letters') as HTMLInputElement).value).toBe('a');
  });

  it('clears the cell when the prompt is submitted blank', () => {
    const { store } = setup({ board: createBoard({ 0: 'a' }), settings });

    openPrompt();
    fireEvent.change(screen.getByPlaceholderText('Letters'), { target: { value: '   ' } });
    fireEvent.submit(screen.getByPlaceholderText('Letters').closest('form')!);

    expect(readBoard(store, 0, 0)).toBe(' ');
  });

  it('toggles direction from the prompt without stealing focus back to the cell', () => {
    setup({ settings });

    openPrompt();
    fireEvent.click(screen.getByTestId('toggle-direction-button'));

    expect(screen.getByTestId('toggle-direction-button').getAttribute('data-direction')).toBe('vertical');
    expect(document.activeElement).not.toBe(getCell('A1'));
  });

  it('does not focus the cell when toggling blank or a filter', () => {
    setup({ board: createBoard({ 0: 'a' }), settings });

    fireEvent.focus(getCell('A1'));
    fireEvent.click(screen.getByLabelText(englishLabel('cell.set-blank')));

    expect(document.activeElement).not.toBe(getCell('A1'));
  });

  it('hides the keyboard shortcut in tooltips on touch devices', async () => {
    setLayout({ isCompact: true, isTouch: true });
    setup({ settings });

    fireEvent.focus(getCell('A1'));
    await flushEffects();

    expect(document.body.textContent).not.toContain('Ctrl');
  });
});

describe('external board changes', () => {
  it('renders new tiles without remounting cell inputs', () => {
    const { store } = setup();
    const input = getCell('A1');

    dispatch(store, boardSlice.actions.changeCellValue({ value: 'z', x: 0, y: 0 }));

    expect(getCell('A1')).toBe(input);
    expect(input.value).toBe('z');
  });

  it('shows a candidate over the board and removes it again', () => {
    const { store } = setup();

    dispatch(store, resultsSlice.actions.changeResultCandidate(createResult({ word: 'at', x: 0, y: 0 })));
    expect(getCell('A1').value).toBe('a');

    dispatch(store, resultsSlice.actions.changeResultCandidate(null));
    expect(getCell('A1').value).toBe('');
  });

  it('shows the filter icon as soon as a filter is toggled', () => {
    const { store } = setup();

    dispatch(store, cellFiltersSlice.actions.toggle({ x: 0, y: 0 }));

    expect(document.querySelectorAll('.iconContainer')).toHaveLength(1);
  });
});

function setup(state: Partial<RootState> = {}) {
  return renderWithStore(<Board />, { state: { rack: [null], solve: solveInitialState, ...state } });
}

function createBoard(tiles: Record<number, string>): BoardModel {
  const config = getConfig(Game.Scrabble, Locale.EN_US);
  const characters = Array<string>(config.boardWidth * config.boardHeight).fill(' ');

  for (const [index, character] of Object.entries(tiles)) {
    characters[Number(index)] = character;
  }

  const board = BoardModel.create(config.boardWidth, config.boardHeight);

  characters.forEach((character, index) => {
    if (character !== ' ') {
      const x = index % config.boardWidth;
      const y = Math.floor(index / config.boardWidth);
      const state = boardSlice.reducer(board, boardSlice.actions.changeCellValue({ value: character, x, y }));

      board.updateCell(x, y, () => state.rows[y][x]);
    }
  });

  return board;
}

function getCell(coordinates: string): HTMLInputElement {
  return screen.getByLabelText(`Board: tile ${coordinates}`);
}

function readCoordinates(): string[] {
  return Array.from(document.querySelectorAll('.coordinate'), (element) => element.textContent ?? '');
}

function readBoard(store: TestStore, x: number, y: number): string {
  return store.getState().board.rows[y][x].tile.character;
}

function readRow(store: TestStore, y: number): string[] {
  return store.getState().board.rows[y].map((cell) => cell.tile.character);
}

function type(coordinates: string, value: string): void {
  fireEvent.focus(getCell(coordinates));
  fireEvent.change(getCell(coordinates), { target: { value } });
}

function focus(coordinates: string): void {
  act(() => {
    getCell(coordinates).focus();
  });
}

function press(coordinates: string, key: string, modifiers: KeyboardEventInit = {}): void {
  fireEvent.keyDown(getCell(coordinates), { key, ...modifiers });
}

function paste(coordinates: string, text: string): void {
  fireEvent.paste(getCell(coordinates), { clipboardData: { getData: () => text } });
}

function openPrompt(): void {
  fireEvent.focus(getCell('A1'));
  fireEvent.click(screen.getByLabelText(englishLabel('cell.enter-word')));
}

function dispatch(store: TestStore, action: Action): void {
  act(() => {
    store.dispatch(action);
  });
}

function englishLabel(key: keyof typeof english): string {
  return english[key];
}
