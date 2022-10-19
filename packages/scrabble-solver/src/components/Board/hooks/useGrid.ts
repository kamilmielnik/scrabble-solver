/* eslint-disable max-lines, max-statements */
import { BLANK, EMPTY_CELL } from '@scrabble-solver/constants';
import { Board, Cell } from '@scrabble-solver/types';
import {
  createRef,
  KeyboardEventHandler,
  RefObject,
  useCallback,
  useMemo,
  useState,
  useRef,
  ChangeEventHandler,
  ChangeEvent,
} from 'react';
import { useDispatch } from 'react-redux';
import { useLatest } from 'react-use';

import { createGridOf, createKeyboardNavigation, extractCharacters, extractInputValue, isCtrl } from 'lib';
import { boardSlice, selectConfig, useTypedSelector } from 'state';

import { getPositionInGrid } from '../lib';
import { Point } from '../types';

const toggleDirection = (direction: Direction) => (direction === 'vertical' ? 'horizontal' : 'vertical');

type Direction = 'horizontal' | 'vertical';

interface State {
  lastDirection: Direction;
  refs: RefObject<HTMLInputElement>[][];
}

interface Actions {
  onChange: ChangeEventHandler<HTMLInputElement>;
  onFocus: (x: number, y: number) => void;
  onDirectionToggle: () => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
}

const useGrid = (rows: Cell[][]): [State, Actions] => {
  const height = rows.length;
  const width = rows[0].length;
  const dispatch = useDispatch();
  const config = useTypedSelector(selectConfig);
  const refs = useMemo(
    () => createGridOf<RefObject<HTMLInputElement>>(width, height, () => createRef()),
    [width, height],
  );
  const activeIndexRef = useRef<Point>({ x: 0, y: 0 });
  const [lastDirection, setLastDirection] = useState<Direction>('horizontal');
  const lastDirectionRef = useLatest(lastDirection);

  const changeActiveIndex = useCallback(
    (offsetX: number, offsetY: number) => {
      const x = Math.min(Math.max(activeIndexRef.current.x + offsetX, 0), width - 1);
      const y = Math.min(Math.max(activeIndexRef.current.y + offsetY, 0), height - 1);
      activeIndexRef.current = { x, y };
      refs[y][x].current?.focus();
    },
    [activeIndexRef, refs],
  );

  const getInputRefPosition = useCallback(
    (inputRef: HTMLInputElement): Point | undefined => {
      return getPositionInGrid(refs, (ref) => ref.current === inputRef);
    },
    [refs],
  );

  const moveFocus = useCallback(
    (offset: number) => {
      if (lastDirectionRef.current === 'horizontal') {
        changeActiveIndex(offset, 0);
      } else {
        changeActiveIndex(0, offset);
      }
    },
    [changeActiveIndex, lastDirectionRef],
  );

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const position = getInputRefPosition(event.target);

      if (!position) {
        return;
      }

      event.preventDefault();

      let board = new Board({ rows: rows.map((row) => row.map((cell) => cell.clone())) });
      let { x, y } = position;
      const value = extractInputValue(event.target);
      const characters = value ? extractCharacters(config, value).filter((character) => character !== BLANK) : [];

      const scheduleMoveFocus = () => {
        if (lastDirection === 'horizontal') {
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
            board = boardSlice.reducer(
              board,
              boardSlice.actions.changeCellValue({ x, y: y - 1, value: twoCharacterCandidate }),
            );
            return;
          }
        }

        if (canCheckDown) {
          const cellDown = board.rows[y + 1][x];
          const twoCharacterCandidate = character + cellDown.tile.character;

          if (!cellDown.tile.isBlank && config.twoCharacterTiles.includes(twoCharacterCandidate)) {
            board = boardSlice.reducer(board, boardSlice.actions.changeCellValue({ x, y, value: character }));
            board = boardSlice.reducer(board, boardSlice.actions.changeCellValue({ x, y: y + 1, value: EMPTY_CELL }));
            scheduleMoveFocus();
            return;
          }
        }

        if (canCheckLeft) {
          const cellLeft = board.rows[y][x - 1];
          const twoCharacterCandidate = cellLeft.tile.character + character;

          if (!cellLeft.tile.isBlank && config.twoCharacterTiles.includes(twoCharacterCandidate)) {
            board = boardSlice.reducer(
              board,
              boardSlice.actions.changeCellValue({ x: x - 1, y, value: twoCharacterCandidate }),
            );
            return;
          }
        }

        if (canCheckRight) {
          const cellRight = board.rows[y][x + 1];
          const twoCharacterCandidate = character + cellRight.tile.character;

          if (!cellRight.tile.isBlank && config.twoCharacterTiles.includes(twoCharacterCandidate)) {
            board = boardSlice.reducer(board, boardSlice.actions.changeCellValue({ x, y, value: character }));
            board = boardSlice.reducer(board, boardSlice.actions.changeCellValue({ x: x + 1, y, value: EMPTY_CELL }));
            scheduleMoveFocus();
            return;
          }
        }

        if (!canCheckDown || !canCheckRight) {
          const cell = board.rows[y][x];
          const twoCharacterCandidate = cell.tile.character + character;

          if (!cell.tile.isBlank && config.twoCharacterTiles.includes(twoCharacterCandidate)) {
            board = boardSlice.reducer(
              board,
              boardSlice.actions.changeCellValue({ x, y, value: twoCharacterCandidate }),
            );
            return;
          }
        }

        board = boardSlice.reducer(board, boardSlice.actions.changeCellValue({ x, y, value: character }));
        scheduleMoveFocus();
      });

      moveFocus(Math.abs(position.x - x) + Math.abs(position.y - y));
      dispatch(boardSlice.actions.change(board));
    },
    [config, lastDirection, moveFocus, rows],
  );

  const onDirectionToggle = useCallback(() => setLastDirection(toggleDirection), []);

  const onFocus = useCallback((x: number, y: number) => {
    activeIndexRef.current = { x, y };
  }, []);

  const onKeyDown = useMemo(() => {
    return createKeyboardNavigation({
      onArrowDown: (event) => {
        event.preventDefault();

        if (isCtrl(event)) {
          onDirectionToggle();
        } else {
          changeActiveIndex(0, 1);
        }
      },
      onArrowLeft: (event) => {
        event.preventDefault();

        if (isCtrl(event)) {
          onDirectionToggle();
        } else {
          changeActiveIndex(-1, 0);
        }
      },
      onArrowRight: (event) => {
        event.preventDefault();

        if (isCtrl(event)) {
          onDirectionToggle();
        } else {
          changeActiveIndex(1, 0);
        }
      },
      onArrowUp: (event) => {
        event.preventDefault();

        if (isCtrl(event)) {
          onDirectionToggle();
        } else {
          changeActiveIndex(0, -1);
        }
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
  }, [changeActiveIndex, config, dispatch, lastDirectionRef, onDirectionToggle, rows]);

  return [
    { lastDirection, refs },
    { onChange, onDirectionToggle, onFocus, onKeyDown },
  ];
};

export default useGrid;
