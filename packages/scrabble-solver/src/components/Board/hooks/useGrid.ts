import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Cell } from '@scrabble-solver/types';
import { createRef, KeyboardEventHandler, RefObject, useCallback, useMemo, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useLatest } from 'react-use';

import { createGridOf, createKeyboardNavigation, isCtrl } from 'lib';
import { boardSlice, selectConfig, useTypedSelector } from 'state';

import { getPositionInGrid } from '../lib';
import { Point } from '../types';

interface State {
  lastDirection: 'horizontal' | 'vertical';
  refs: RefObject<HTMLInputElement>[][];
}

interface Actions {
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
  const [lastDirection, setLastDirection] = useState<'horizontal' | 'vertical'>('horizontal');
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

  const onDirectionToggle = useCallback(() => {
    setLastDirection((direction) => {
      return direction === 'vertical' ? 'horizontal' : 'vertical';
    });
  }, []);

  const onFocus = useCallback((x: number, y: number) => {
    activeIndexRef.current = { x, y };
  }, []);

  const onMoveFocus = useCallback(
    (direction: 'backward' | 'forward') => {
      const offset = direction === 'forward' ? 1 : -1;

      if (lastDirectionRef.current === 'horizontal') {
        changeActiveIndex(offset, 0);
      } else {
        changeActiveIndex(0, offset);
      }
    },
    [changeActiveIndex, lastDirectionRef],
  );

  const onKeyDown = useMemo(() => {
    return createKeyboardNavigation({
      onArrowDown: (event) => {
        if (isCtrl(event)) {
          onDirectionToggle();
        } else {
          changeActiveIndex(0, 1);
        }
      },
      onArrowLeft: (event) => {
        if (isCtrl(event)) {
          onDirectionToggle();
        } else {
          changeActiveIndex(-1, 0);
        }
      },
      onArrowRight: (event) => {
        if (isCtrl(event)) {
          onDirectionToggle();
        } else {
          changeActiveIndex(1, 0);
        }
      },
      onArrowUp: (event) => {
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

        dispatch(boardSlice.actions.changeCellValue({ ...position, value: EMPTY_CELL }));
        onMoveFocus('backward');
      },
      onDelete: (event) => {
        const position = getInputRefPosition(event.target as HTMLInputElement);

        if (!position) {
          return;
        }

        dispatch(boardSlice.actions.changeCellValue({ ...position, value: EMPTY_CELL }));
        onMoveFocus('forward');
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
          dispatch(boardSlice.actions.toggleCellIsBlank(position));
          return;
        }

        if (isCtrl(event) && twoCharacterTile) {
          event.preventDefault();
          dispatch(boardSlice.actions.changeCellValue({ x, y, value: twoCharacterTile }));
          onMoveFocus('forward');
          return;
        }

        if (!config.hasCharacter(character)) {
          return;
        }

        const canCheckUp = y - 1 > 0;
        const canCheckLeft = x > 0;
        const canCheckRight = x + 1 < width;
        const canCheckDown = y + 1 < height;

        if (canCheckUp) {
          const cellUp = rows[y - 1][x];
          const twoCharacterCandidate = cellUp.tile.character + character;

          if (config.twoCharacterTiles.includes(twoCharacterCandidate)) {
            dispatch(boardSlice.actions.changeCellValue({ ...position, y: y - 1, value: twoCharacterCandidate }));
            return;
          }
        }

        if (canCheckDown) {
          const cellDown = rows[y + 1][x];
          const twoCharacterCandidate = character + cellDown.tile.character;

          if (config.twoCharacterTiles.includes(twoCharacterCandidate)) {
            dispatch(boardSlice.actions.changeCellValue({ ...position, value: character }));
            dispatch(boardSlice.actions.changeCellValue({ ...position, y: y + 1, value: EMPTY_CELL }));
            onMoveFocus('forward');
            return;
          }
        }

        if (canCheckLeft) {
          const cellLeft = rows[y][x - 1];
          const twoCharacterCandidate = cellLeft.tile.character + character;

          if (config.twoCharacterTiles.includes(twoCharacterCandidate)) {
            dispatch(boardSlice.actions.changeCellValue({ ...position, x: x - 1, value: twoCharacterCandidate }));
            return;
          }
        }

        if (canCheckRight) {
          const cellRight = rows[y][x + 1];
          const twoCharacterCandidate = character + cellRight.tile.character;

          if (config.twoCharacterTiles.includes(twoCharacterCandidate)) {
            dispatch(boardSlice.actions.changeCellValue({ ...position, value: character }));
            dispatch(boardSlice.actions.changeCellValue({ ...position, x: x + 1, value: EMPTY_CELL }));
            onMoveFocus('forward');
            return;
          }
        }

        if (!canCheckDown || !canCheckRight) {
          const cell = rows[y][x];
          const twoCharacterCandidate = cell.tile.character + character;

          if (config.twoCharacterTiles.includes(twoCharacterCandidate)) {
            dispatch(boardSlice.actions.changeCellValue({ ...position, value: twoCharacterCandidate }));
            return;
          }
        }

        dispatch(boardSlice.actions.changeCellValue({ ...position, value: character }));
        onMoveFocus('forward');
      },
    });
  }, [changeActiveIndex, config, dispatch, lastDirectionRef, onDirectionToggle, rows]);

  return [
    { lastDirection, refs },
    { onDirectionToggle, onFocus, onKeyDown },
  ];
};

export default useGrid;
