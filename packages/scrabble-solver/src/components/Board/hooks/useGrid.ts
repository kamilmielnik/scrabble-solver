/* eslint-disable max-lines, max-statements */
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
  useRef,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { useLatest } from 'react-use';
import { AnyAction } from 'redux';

import { LOCALE_FEATURES } from 'i18n';
import { createGridOf, createKeyboardNavigation, extractCharacters, extractInputValue, isCtrl } from 'lib';
import { boardSlice, selectConfig, selectLocale, useTypedSelector } from 'state';
import { Direction } from 'types';

import { Point } from '../types';

const toggleDirection = (direction: Direction) => (direction === 'vertical' ? 'horizontal' : 'vertical');

interface State {
  activePosition: Point;
  direction: Direction;
  inputRef: RefObject<HTMLInputElement>;
  tileRefs: RefObject<HTMLDivElement>[][];
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
  const tileRefs = useMemo(
    () => createGridOf<RefObject<HTMLDivElement>>(width, height, () => createRef()),
    [width, height],
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [activePosition, setActivePosition] = useState<Point>({ x: 0, y: 0 });
  const [direction, setLastDirection] = useState<Direction>('horizontal');
  const directionRef = useLatest(direction);

  const changeActivePosition = useCallback(
    (offsetX: number, offsetY: number) => {
      const x = Math.min(Math.max(activePosition.x + offsetX, 0), width - 1);
      const y = Math.min(Math.max(activePosition.y + offsetY, 0), height - 1);
      setActivePosition({ x, y });
      inputRef.current?.focus();
    },
    [activePosition, inputRef],
  );

  const moveFocus = useCallback(
    (offset: number) => {
      if (directionRef.current === 'horizontal') {
        changeActivePosition(offset, 0);
      } else {
        changeActivePosition(0, offset);
      }
    },
    [changeActivePosition, directionRef],
  );

  const insertValue = useCallback(
    (position: Point, value: string) => {
      const characters = value ? extractCharacters(config, value).filter((character) => character !== BLANK) : [BLANK];
      const actions: AnyAction[] = [];
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
      if (!activePosition) {
        return;
      }

      const value = extractInputValue(event.target);

      if (!value) {
        dispatch(boardSlice.actions.changeCellValue({ ...activePosition, value: EMPTY_CELL }));
        moveFocus(-1);
        return;
      }

      if (value === EMPTY_CELL) {
        const { x, y } = activePosition;
        const cell = rows[y][x];

        if (cell.hasTile()) {
          dispatch(boardSlice.actions.toggleCellIsBlank(activePosition));
          return;
        }
      }

      insertValue(activePosition, value);
    },
    [activePosition, dispatch, insertValue, moveFocus, rows],
  );

  const onDirectionToggle = useCallback(() => setLastDirection(toggleDirection), []);

  const onFocus = useCallback((x: number, y: number) => {
    setActivePosition({ x, y });
  }, []);

  const onKeyDown = useMemo(() => {
    return createKeyboardNavigation({
      onArrowDown: (event) => {
        event.preventDefault();

        if (isCtrl(event)) {
          onDirectionToggle();
        } else {
          changeActivePosition(0, 1);
        }
      },
      onArrowLeft: (event) => {
        event.preventDefault();

        if (isCtrl(event)) {
          onDirectionToggle();
        } else {
          changeActivePosition(LOCALE_FEATURES[locale].direction === 'ltr' ? -1 : 1, 0);
        }
      },
      onArrowRight: (event) => {
        event.preventDefault();

        if (isCtrl(event)) {
          onDirectionToggle();
        } else {
          changeActivePosition(LOCALE_FEATURES[locale].direction === 'ltr' ? 1 : -1, 0);
        }
      },
      onArrowUp: (event) => {
        event.preventDefault();

        if (isCtrl(event)) {
          onDirectionToggle();
        } else {
          changeActivePosition(0, -1);
        }
      },
      onBackspace: (event) => {
        if (!activePosition) {
          return;
        }

        event.preventDefault();
        dispatch(boardSlice.actions.changeCellValue({ ...activePosition, value: EMPTY_CELL }));
        moveFocus(-1);
      },
      onDelete: (event) => {
        if (!activePosition) {
          return;
        }

        event.preventDefault();
        dispatch(boardSlice.actions.changeCellValue({ ...activePosition, value: EMPTY_CELL }));
        moveFocus(1);
      },
      onKeyDown: (event) => {
        if (!activePosition) {
          return;
        }

        const { x, y } = activePosition;
        const character = event.key.toLowerCase();
        const isTogglingBlank = isCtrl(event) && character === 'b';
        const twoCharacterTile = config.getTwoCharacterTileByPrefix(character);

        if (isTogglingBlank) {
          event.preventDefault();
          dispatch(boardSlice.actions.toggleCellIsBlank(activePosition));
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
          dispatch(boardSlice.actions.changeCellValue({ ...activePosition, value: twoCharacterCandidate }));
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
        if (!activePosition) {
          return;
        }

        event.preventDefault();
        dispatch(boardSlice.actions.toggleCellIsBlank(activePosition));
      },
    });
  }, [activePosition, changeActivePosition, config, dispatch, locale, moveFocus, onDirectionToggle, rows]);

  const onPaste = useCallback<ClipboardEventHandler>(
    (event) => {
      if (!(event.target instanceof HTMLInputElement)) {
        return;
      }

      if (!activePosition) {
        return;
      }

      event.preventDefault();

      const value = event.clipboardData.getData('text/plain').toLocaleLowerCase();
      insertValue(activePosition, value);
    },
    [activePosition, insertValue],
  );

  return [
    { activePosition, direction, inputRef, tileRefs },
    { onChange, onDirectionToggle, onFocus, onKeyDown, onPaste },
  ];
};

export default useGrid;
