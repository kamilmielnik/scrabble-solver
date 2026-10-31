/* eslint-disable max-lines */

import { getConfig } from '@scrabble-solver/configs';
import { Cell as CellModel, Game, Locale, Tile } from '@scrabble-solver/types';
import { act, fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { type ComponentProps, createRef } from 'react';

import { noop } from '../../../../lib/noop';
import { boardSlice } from '../../../../state/board';
import { cellFiltersSlice } from '../../../../state/cellFilters';
import { hoveredTileSlice } from '../../../../state/hoveredTile';
import { rackSlice } from '../../../../state/rack';
import { resultsSlice } from '../../../../state/results';
import { settingsSlice } from '../../../../state/settings';
import { renderWithStore } from '../../../../test/render';
import { type Translate } from '../../../../types';

import { Cell } from './Cell';

const config = getConfig(Game.Scrabble, Locale.EN_US);
const letterCell = new CellModel({ isEmpty: false, tile: new Tile({ character: 'a' }), x: 5, y: 6 });

describe('render budget', () => {
  it.each([
    ['Cell', join(import.meta.dir, 'Cell.tsx')],
    ['Tile', join(import.meta.dir, '../../../Tile/Tile.tsx')],
    ['TilePure', join(import.meta.dir, '../../../Tile/TilePure.tsx')],
  ])('%s never subscribes to the store', (_name, path) => {
    const source = readFileSync(path, 'utf8');

    expect(source).not.toMatch(/useSelector|useTypedSelector|useTranslate|connect\(/);
  });

  it('does not re-render on any store change', () => {
    const translate = createTranslate();
    const { store } = setup({ translate });
    const renders = translate.mock.calls.length;

    act(() => {
      store.dispatch(settingsSlice.actions.changeInputMode('touchscreen'));
      store.dispatch(settingsSlice.actions.changeShowCoordinates('alternative'));
      store.dispatch(hoveredTileSlice.actions.set('a'));
      store.dispatch(boardSlice.actions.changeCellValue({ value: 'z', x: 5, y: 6 }));
      store.dispatch(cellFiltersSlice.actions.toggle({ x: 5, y: 6 }));
      store.dispatch(rackSlice.actions.changeCharacter({ character: 'a', index: 0 }));
      store.dispatch(resultsSlice.actions.changeQuery('x'));
    });

    expect(translate.mock.calls.length).toBe(renders);
  });

  it('reads the input mode at event time, not at render time', () => {
    const onFocus = mock();
    const { store } = setup({ onFocus });

    act(() => {
      store.dispatch(settingsSlice.actions.changeInputMode('touchscreen'));
    });

    expect(fireEvent.mouseDown(getInput())).toBe(false);
  });
});

describe('Cell', () => {
  it('labels the tile with its coordinates in the active mode', () => {
    setup({ cell: new CellModel({ x: 1, y: 2 }) });

    expect(screen.getByLabelText('cell.tile.location B3')).toBeDefined();
  });

  it('swaps coordinates in alternative mode', () => {
    setup({ cell: new CellModel({ x: 1, y: 2 }), showCoordinates: 'alternative' });

    expect(screen.getByLabelText('cell.tile.location 2C')).toBeDefined();
  });

  it('shows the letter and its points', () => {
    setup();

    expect(getTile().textContent).toBe('a1');
    expect(getTile().className).toContain('raised');
  });

  it('shows no points or raise for an empty cell', () => {
    setup({ cell: new CellModel({ x: 0, y: 0 }) });

    expect(getTile().textContent).toBe('');
    expect(getTile().className).not.toContain('raised');
  });

  it('scores a blank with the blank score', () => {
    setup({
      cell: new CellModel({ isEmpty: false, tile: new Tile({ character: 'q', isBlank: true }), x: 0, y: 0 }),
    });

    expect(getTile().textContent).toBe('q0');
  });

  it('marks a letter outside the config as invalid and an empty cell as valid', () => {
    const invalid = new CellModel({ isEmpty: false, tile: new Tile({ character: 'ą' }), x: 0, y: 0 });

    setup({ cell: invalid });
    expect(getTile().className).toContain('invalid');
  });

  it('keeps the first cell in the tab order and removes the others', () => {
    setup({ cell: new CellModel({ x: 0, y: 0 }) });
    expect(getInput().tabIndex).not.toBe(-1);
  });

  it('removes other cells from the tab order', () => {
    setup();

    expect(getInput().tabIndex).toBe(-1);
  });

  it('marks the first and last three columns for scroll margins', () => {
    setup({ cell: new CellModel({ x: 2, y: 0 }) });
    expect(getTile().className).toContain('first3');
  });

  it('marks the last three columns', () => {
    setup({ cell: new CellModel({ x: 12, y: 0 }) });

    expect(getTile().className).toContain('last3');
    expect(getTile().className).not.toContain('first3');
  });

  it('sharpens only the corners that touch a neighboring tile', () => {
    setup({ cellTop: letterCell });

    expect(getTile().className).toContain('sharpTopLeft');
    expect(getTile().className).toContain('sharpTopRight');
    expect(getTile().className).not.toContain('sharpBottomLeft');
  });

  it('sharpens bottom corners for a tile below, and side corners for side neighbors', () => {
    setup({ cellBottom: letterCell, cellRight: letterCell });

    expect(getTile().className).toContain('sharpBottomLeft');
    expect(getTile().className).toContain('sharpBottomRight');
    expect(getTile().className).toContain('sharpTopRight');
    expect(getTile().className).not.toContain('sharpTopLeft');
  });

  it('sharpens left corners for a tile on the left', () => {
    setup({ cellLeft: letterCell });

    expect(getTile().className).toContain('sharpTopLeft');
    expect(getTile().className).toContain('sharpBottomLeft');
  });

  it('dims an unreachable cell', () => {
    setup({ isReachable: false });

    expect(getTile().className).toContain('unreachable');
  });

  it('reports focus, mouse and touch with its position', () => {
    const onFocus = mock<(x: number, y: number) => void>();

    setup({ onFocus });
    fireEvent.focus(getInput());
    fireEvent.mouseDown(getInput());
    fireEvent.touchStart(getInput());

    expect(onFocus.mock.calls).toEqual([
      [5, 6],
      [5, 6],
      [5, 6],
    ]);
  });
});

function createTranslate() {
  return mock<Translate>((key, replacements) => `${key} ${replacements?.coordinates ?? ''}`.trim());
}

function setup(props: Partial<ComponentProps<typeof Cell>> = {}) {
  return renderWithStore(
    <Cell
      cell={letterCell}
      config={config}
      inputRef={createRef()}
      locale={Locale.EN_US}
      showCoordinates="original"
      translate={createTranslate()}
      onChange={noop}
      onFocus={noop}
      {...props}
    />,
  );
}

function getInput(): HTMLInputElement {
  return document.querySelector('input')!;
}

function getTile(): HTMLElement {
  return getInput().parentElement!;
}
