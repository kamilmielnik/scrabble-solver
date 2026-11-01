/* eslint-disable max-lines, max-statements */
import { type PayloadAction } from '@reduxjs/toolkit';
import { BLANK, EMPTY_CELL } from '@scrabble-solver/constants';
import { type Cell, Board } from '@scrabble-solver/types';
import {
  type ChangeEvent,
  type ChangeEventHandler,
  type ClipboardEventHandler,
  type KeyboardEventHandler,
  type RefObject,
  createRef,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';

import { useLatest } from '@/hooks/useLatest';
import { LOCALE_FEATURES } from '@/i18n/constants';
import { type KeyboardNavigationHandlers, createKeyboardNavigation } from '@/lib/createKeyboardNavigation';
import { extractCharacters } from '@/lib/extractCharacters';
import { extractInputValue } from '@/lib/extractInputValue';
import { isCtrl } from '@/lib/isCtrl';
import { boardSlice, cellFiltersSlice, selectConfig, selectLocale, useTypedSelector } from '@/state';
import { type Direction, type Point } from '@/types';

import { continuesDigraph, findDigraphJoin, findJoinInLastCell } from '../findDigraphJoin';
import { createGrid, getPositionInGrid, isSamePoint, toggleDirection } from '../lib';

interface State {
  activeIndex: Point;
  direction: Direction;
  inputRefs: RefObject<HTMLInputElement | null>[][];
}

interface Actions {
  insertValue: (position: Point, value: string) => void;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onDirectionToggle: () => void;
  onFocus: (x: number, y: number) => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onPaste: ClipboardEventHandler<HTMLInputElement>;
}

export const useGrid = (rows: Cell[][]): [State, Actions] => {
  const height = rows.length;
  const width = rows[0].length;
  const dispatch = useDispatch();
  const config = useTypedSelector(selectConfig);
  const locale = useTypedSelector(selectLocale);
  const inputRefs = useMemo(
    () => createGrid<RefObject<HTMLInputElement | null>>(width, height, () => createRef()),
    [width, height],
  );
  const [activeIndex, setActiveIndex] = useState<Point>({ x: 0, y: 0 });
  const [direction, setLastDirection] = useState<Direction>('horizontal');
  const directionRef = useLatest(direction);
  const rowsRef = useLatest(rows);

  const safeActiveIndex = useMemo(
    () => ({
      x: Math.min(activeIndex.x, width - 1),
      y: Math.min(activeIndex.y, height - 1),
    }),
    [activeIndex, width, height],
  );

  const changeActiveIndex = useCallback(
    (offsetX: number, offsetY: number) => {
      const x = Math.min(Math.max(safeActiveIndex.x + offsetX, 0), width - 1);
      const y = Math.min(Math.max(safeActiveIndex.y + offsetY, 0), height - 1);
      setActiveIndex({ x, y });
      inputRefs[y][x].current?.focus();
    },
    [safeActiveIndex, height, inputRefs, width],
  );

  const getInputRefPosition = useCallback(
    (inputRef: HTMLInputElement): Point | undefined => {
      return getPositionInGrid(inputRefs, (ref) => ref.current === inputRef);
    },
    [inputRefs],
  );

  const moveFocus = useCallback(
    (offset: number) => {
      if (directionRef.current === 'horizontal') {
        changeActiveIndex(offset, 0);
      } else {
        changeActiveIndex(0, offset);
      }
    },
    [changeActiveIndex, directionRef],
  );

  const insertValue = useCallback(
    (position: Point, value: string) => {
      const characters = value
        ? extractCharacters(config, value, { keepDigraphParts: true }).filter((character) => character !== BLANK)
        : [BLANK];
      const actions: PayloadAction<unknown>[] = [];
      let board = new Board({ rows: rowsRef.current.map((row) => row.map((cell) => cell.clone())) });
      let { x, y } = position;
      let hasFilledLastCell = false;

      function changeCellValue(cell: Point, cellValue: string, isBlank = false): void {
        const action = boardSlice.actions.changeCellValue({ ...cell, isBlank, value: cellValue });
        board = boardSlice.reducer(board, action);
        actions.push(action);
      }

      function moveOn(filledCell: Point, nextPosition: Point): void {
        hasFilledLastCell = isSamePoint(filledCell, nextPosition);
        ({ x, y } = nextPosition);
      }

      characters.forEach((character) => {
        const options = { board, character, config, direction: directionRef.current, position: { x, y } };
        const join = hasFilledLastCell ? findJoinInLastCell(options) : findDigraphJoin(options);

        if (join) {
          changeCellValue(join.target, join.value, join.isBlank);
          join.clearedCells.forEach((cell) => changeCellValue(cell, EMPTY_CELL));
          moveOn(join.target, join.nextPosition);
          return;
        }

        if (hasFilledLastCell) {
          return;
        }

        if (config.hasCharacter(character) || character === BLANK || continuesDigraph(options)) {
          changeCellValue({ x, y }, character);
          moveOn(
            { x, y },
            directionRef.current === 'horizontal'
              ? { x: Math.min(x + 1, config.boardWidth - 1), y }
              : { x, y: Math.min(y + 1, config.boardHeight - 1) },
          );
        }
      });

      moveFocus(x - position.x + y - position.y);
      actions.forEach(dispatch);
    },
    [config, directionRef, dispatch, moveFocus, rowsRef],
  );

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const position = getInputRefPosition(event.target);

      if (!position) {
        return;
      }

      const value = extractInputValue(event.target, config.locale);

      if (!value) {
        dispatch(boardSlice.actions.changeCellValue({ ...position, value: EMPTY_CELL }));
        moveFocus(-1);
        return;
      }

      if (value === EMPTY_CELL) {
        const { x, y } = position;
        const cell = rowsRef.current[y][x];

        if (cell.hasTile()) {
          dispatch(boardSlice.actions.toggleCellIsBlank(position));
          return;
        }
      }

      insertValue(position, value);
    },
    [config.locale, dispatch, insertValue, moveFocus, rowsRef, getInputRefPosition],
  );

  const onDirectionToggle = useCallback(() => setLastDirection(toggleDirection), []);

  const onFocus = useCallback((x: number, y: number) => {
    setActiveIndex({ x, y });
  }, []);

  const keyboardNavigationHandlers = useMemo((): KeyboardNavigationHandlers => {
    return {
      onArrowDown: (event) => {
        event.preventDefault();

        if (direction === 'horizontal') {
          onDirectionToggle();
        } else {
          changeActiveIndex(0, 1);
        }
      },
      onArrowLeft: (event) => {
        event.preventDefault();

        if (direction === 'vertical') {
          onDirectionToggle();
          changeActiveIndex(LOCALE_FEATURES[locale].direction === 'ltr' ? -1 : 0, 0);
        } else {
          changeActiveIndex(LOCALE_FEATURES[locale].direction === 'ltr' ? -1 : 1, 0);
        }
      },
      onArrowRight: (event) => {
        event.preventDefault();

        if (direction === 'vertical') {
          onDirectionToggle();
          changeActiveIndex(LOCALE_FEATURES[locale].direction === 'ltr' ? 0 : -1, 0);
        } else {
          changeActiveIndex(LOCALE_FEATURES[locale].direction === 'ltr' ? 1 : -1, 0);
        }
      },
      onArrowUp: (event) => {
        event.preventDefault();

        if (direction === 'horizontal') {
          onDirectionToggle();
        }

        changeActiveIndex(0, -1);
      },
      onBackspace: (event) => {
        const position = getInputRefPosition(event.target as HTMLInputElement);

        if (!position) {
          return;
        }

        event.preventDefault();
        dispatch(boardSlice.actions.changeCellValue({ ...position, value: EMPTY_CELL }));
        moveFocus(-1);
      },
      onDelete: (event) => {
        const position = getInputRefPosition(event.target as HTMLInputElement);

        if (!position) {
          return;
        }

        event.preventDefault();
        dispatch(boardSlice.actions.changeCellValue({ ...position, value: EMPTY_CELL }));
        moveFocus(1);
      },
      onKeyDown: (event) => {
        const position = getInputRefPosition(event.target as HTMLInputElement);

        if (!position) {
          return;
        }

        const { x, y } = position;
        const character = event.key.toLocaleLowerCase(config.locale);
        const digraph = config.getDigraphByShortcut(character);

        if (isCtrl(event) && digraph) {
          event.preventDefault();
          dispatch(boardSlice.actions.changeCellValue({ x, y, value: digraph }));
          moveFocus(1);
          return;
        }

        const cell = rowsRef.current[y][x];

        if (isCtrl(event) && character === 'g') {
          event.preventDefault();

          if (!cell.hasTile()) {
            dispatch(cellFiltersSlice.actions.toggle(position));
          }

          return;
        }

        // A join search takes under 2 µs, so it runs in every language and runs again in insertValue.
        const board = new Board({ rows: rowsRef.current });

        if (!isCtrl(event) && findDigraphJoin({ board, character, config, direction, position })) {
          event.preventDefault();
          insertValue(position, character);
          return;
        }

        if (
          event.target instanceof HTMLInputElement &&
          event.target.value.toLocaleLowerCase(config.locale) === character
        ) {
          // change event did not fire because the same character was typed over the current one
          // but we still want to move the caret
          event.preventDefault();
          moveFocus(1);
        }
      },
      onSpace: (event) => {
        const position = getInputRefPosition(event.target as HTMLInputElement);

        if (!position) {
          return;
        }

        event.preventDefault();
        dispatch(boardSlice.actions.toggleCellIsBlank(position));
      },
    };
  }, [
    changeActiveIndex,
    config,
    direction,
    dispatch,
    getInputRefPosition,
    insertValue,
    locale,
    moveFocus,
    onDirectionToggle,
    rowsRef,
  ]);

  const onKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    (event) => createKeyboardNavigation(keyboardNavigationHandlers)(event),
    [keyboardNavigationHandlers],
  );

  const onPaste = useCallback<ClipboardEventHandler>(
    (event) => {
      if (!(event.target instanceof HTMLInputElement)) {
        return;
      }

      const position = getInputRefPosition(event.target);

      if (!position) {
        return;
      }

      event.preventDefault();

      const value = event.clipboardData.getData('text/plain').toLocaleLowerCase(config.locale);
      insertValue(position, value);
    },
    [config.locale, getInputRefPosition, insertValue],
  );

  return [
    { activeIndex: safeActiveIndex, direction, inputRefs },
    { insertValue, onChange, onDirectionToggle, onFocus, onKeyDown, onPaste },
  ];
};
