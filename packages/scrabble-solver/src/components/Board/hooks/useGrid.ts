/* eslint-disable max-lines, max-statements */
import { PayloadAction } from '@reduxjs/toolkit';
import { BLANK, EMPTY_CELL } from '@scrabble-solver/constants';
import { Board, Cell } from '@scrabble-solver/types';
import {
  ChangeEvent,
  ChangeEventHandler,
  ClipboardEventHandler,
  createRef,
  KeyboardEventHandler,
  RefObject,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';

import { useLatest } from 'hooks';
import { LOCALE_FEATURES } from 'i18n';
import { createGridOf, createKeyboardNavigation, extractCharacters, extractInputValue, isCtrl } from 'lib';
import { boardSlice, selectConfig, selectLocale, useTypedSelector } from 'state';
import { Direction, Point } from 'types';

import { getPositionInGrid } from '../lib';

const toggleDirection = (direction: Direction) => (direction === 'vertical' ? 'horizontal' : 'vertical');

interface State {
  activeIndex: Point;
  direction: Direction;
  inputRefs: RefObject<HTMLInputElement>[][];
}

interface Actions {
  onChange: ChangeEventHandler<HTMLInputElement>;
  onDirectionToggle: () => void;
  onFocus: (x: number, y: number) => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onPaste: ClipboardEventHandler<HTMLInputElement>;
}

const useGrid = (rows: Cell[][]): [State, Actions] => {
  const height = rows.length;
  const width = rows[0].length;
  const dispatch = useDispatch();
  const config = useTypedSelector(selectConfig);
  const locale = useTypedSelector(selectLocale);
  const inputRefs = useMemo(
    () => createGridOf<RefObject<HTMLInputElement>>(width, height, () => createRef()),
    [width, height],
  );
  const [activeIndex, setActiveIndex] = useState<Point>({ x: 0, y: 0 });
  const [direction, setLastDirection] = useState<Direction>('horizontal');
  const directionRef = useLatest(direction);

  const changeActiveIndex = useCallback(
    (offsetX: number, offsetY: number) => {
      const x = Math.min(Math.max(activeIndex.x + offsetX, 0), width - 1);
      const y = Math.min(Math.max(activeIndex.y + offsetY, 0), height - 1);
      setActiveIndex({ x, y });
      inputRefs[y][x].current?.focus();
    },
    [activeIndex, inputRefs],
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
      const characters = value ? extractCharacters(config, value).filter((character) => character !== BLANK) : [BLANK];
      const actions: PayloadAction<unknown>[] = [];
      let board = new Board({ rows: rows.map((row) => row.map((cell) => cell.clone())) });
      let { x, y } = position;

      const scheduleMoveFocus = () => {
        if (directionRef.current === 'horizontal') {
          ++x;
        } else {
          ++y;
        }
      };

      characters.forEach((character) => {
        if (x >= config.boardWidth || y >= config.boardHeight) {
          return;
        }

        const canCheckUp = y - 1 > 0;
        const canCheckLeft = x > 0;
        const canCheckRight = x + 1 < width;
        const canCheckDown = y + 1 < height;

        if (canCheckUp) {
          const cellUp = board.rows[y - 1][x];
          const twoCharacterCandidate = cellUp.tile.character + character;

          if (!cellUp.tile.isBlank && config.twoCharacterTiles.includes(twoCharacterCandidate)) {
            const action = boardSlice.actions.changeCellValue({ x, y: y - 1, value: twoCharacterCandidate });
            board = boardSlice.reducer(board, action);
            actions.push(action);
            return;
          }
        }

        if (canCheckDown) {
          const cellDown = board.rows[y + 1][x];
          const twoCharacterCandidate = character + cellDown.tile.character;

          if (!cellDown.tile.isBlank && config.twoCharacterTiles.includes(twoCharacterCandidate)) {
            const action1 = boardSlice.actions.changeCellValue({ x, y, value: character });
            const action2 = boardSlice.actions.changeCellValue({ x, y: y + 1, value: EMPTY_CELL });
            board = boardSlice.reducer(boardSlice.reducer(board, action1), action2);
            actions.push(action1, action2);
            scheduleMoveFocus();
            return;
          }
        }

        if (canCheckLeft) {
          const cellLeft = board.rows[y][x - 1];
          const twoCharacterCandidate = cellLeft.tile.character + character;

          if (!cellLeft.tile.isBlank && config.twoCharacterTiles.includes(twoCharacterCandidate)) {
            const action = boardSlice.actions.changeCellValue({ x: x - 1, y, value: twoCharacterCandidate });
            board = boardSlice.reducer(board, action);
            actions.push(action);
            return;
          }
        }

        if (canCheckRight) {
          const cellRight = board.rows[y][x + 1];
          const twoCharacterCandidate = character + cellRight.tile.character;

          if (!cellRight.tile.isBlank && config.twoCharacterTiles.includes(twoCharacterCandidate)) {
            const action1 = boardSlice.actions.changeCellValue({ x, y, value: character });
            const action2 = boardSlice.actions.changeCellValue({ x: x + 1, y, value: EMPTY_CELL });
            board = boardSlice.reducer(boardSlice.reducer(board, action1), action2);
            actions.push(action1, action2);
            scheduleMoveFocus();
            return;
          }
        }

        if (!canCheckDown || !canCheckRight) {
          const cell = board.rows[y][x];
          const twoCharacterCandidate = cell.tile.character + character;

          if (!cell.tile.isBlank && config.twoCharacterTiles.includes(twoCharacterCandidate)) {
            const action = boardSlice.actions.changeCellValue({ x, y, value: twoCharacterCandidate });
            board = boardSlice.reducer(board, action);
            actions.push(action);
            return;
          }
        }

        const action = boardSlice.actions.changeCellValue({ x, y, value: character });
        board = boardSlice.reducer(board, action);
        actions.push(action);
        scheduleMoveFocus();
      });

      moveFocus(Math.abs(position.x - x) + Math.abs(position.y - y));
      actions.forEach(dispatch);
    },
    [config, directionRef, dispatch, moveFocus, rows],
  );

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const position = getInputRefPosition(event.target);

      if (!position) {
        return;
      }

      const value = extractInputValue(event.target);

      if (!value) {
        dispatch(boardSlice.actions.changeCellValue({ ...position, value: EMPTY_CELL }));
        moveFocus(-1);
        return;
      }

      if (value === EMPTY_CELL) {
        const { x, y } = position;
        const cell = rows[y][x];

        if (cell.hasTile()) {
          dispatch(boardSlice.actions.toggleCellIsBlank(position));
          return;
        }
      }

      insertValue(position, value);
    },
    [dispatch, insertValue, moveFocus, rows],
  );

  const onDirectionToggle = useCallback(() => setLastDirection(toggleDirection), []);

  const onFocus = useCallback((x: number, y: number) => {
    setActiveIndex({ x, y });
  }, []);

  const onKeyDown = useMemo(() => {
    return createKeyboardNavigation({
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
        const character = event.key.toLowerCase();
        const isTogglingBlank = isCtrl(event) && character === 'b';
        const twoCharacterTile = config.getTwoCharacterTileByPrefix(character);

        if (isTogglingBlank) {
          event.preventDefault();
          dispatch(boardSlice.actions.toggleCellIsBlank(position));
          return;
        }

        if (isCtrl(event) && twoCharacterTile) {
          event.preventDefault();
          dispatch(boardSlice.actions.changeCellValue({ x, y, value: twoCharacterTile }));
          moveFocus(1);
          return;
        }

        const cell = rows[y][x];
        const twoCharacterCandidate = cell.tile.character + character;

        if (config.twoCharacterTiles.includes(twoCharacterCandidate)) {
          event.preventDefault();
          dispatch(boardSlice.actions.changeCellValue({ ...position, value: twoCharacterCandidate }));
          moveFocus(1);
          return;
        }

        if (event.target instanceof HTMLInputElement && event.target.value === event.key) {
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
    });
  }, [changeActiveIndex, config, direction, dispatch, locale, moveFocus, onDirectionToggle, rows]);

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

      const value = event.clipboardData.getData('text/plain').toLocaleLowerCase();
      insertValue(position, value);
    },
    [insertValue],
  );

  return [
    { activeIndex, direction, inputRefs },
    { onChange, onDirectionToggle, onFocus, onKeyDown, onPaste },
  ];
};

export default useGrid;
