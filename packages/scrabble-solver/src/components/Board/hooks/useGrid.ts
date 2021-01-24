import { EMPTY_CELL } from '@scrabble-solver/constants';
import { createRef, KeyboardEventHandler, RefObject, useCallback, useMemo, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useLatest } from 'react-use';

import { createGridOf, createKeyboardNavigation, isCtrl } from 'lib';
import { boardSlice, selectConfig, useTypedSelector } from 'state';

interface Parameters {
  height: number;
  width: number;
}

interface Point {
  x: number;
  y: number;
}

interface State {
  lastDirection: 'horizontal' | 'vertical';
  refs: RefObject<HTMLInputElement>[][];
}

interface Actions {
  onFocus: (x: number, y: number) => void;
  onDirectionToggle: () => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
}

const useGrid = ({ height, width }: Parameters): [State, Actions] => {
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
    function getInputRefPosition(inputRef: HTMLInputElement): Point | undefined {
      for (let y = 0; y < refs.length; ++y) {
        for (let x = 0; x < refs[0].length; ++x) {
          const ref = refs[y][x];

          if (ref.current === inputRef) {
            return { x, y };
          }
        }
      }

      return undefined;
    },
    [refs],
  );

  const onDirectionToggle = useCallback(() => {
    setLastDirection((direction) => {
      return direction === 'vertical' ? 'horizontal' : 'vertical';
    });
  }, []);

  const onFocus = useCallback((x, y) => {
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

        if (position) {
          dispatch(boardSlice.actions.changeCellValue({ ...position, value: EMPTY_CELL }));
        }

        onMoveFocus('backward');
      },
      onDelete: (event) => {
        const position = getInputRefPosition(event.target as HTMLInputElement);

        if (position) {
          dispatch(boardSlice.actions.changeCellValue({ ...position, value: EMPTY_CELL }));
        }

        onMoveFocus('forward');
      },
      onKeyDown: (event) => {
        const position = getInputRefPosition(event.target as HTMLInputElement);

        if (!position) {
          return;
        }

        const character = event.key.toLowerCase();
        const isTogglingBlank = isCtrl(event) && character === 'b';

        if (isTogglingBlank) {
          dispatch(boardSlice.actions.toggleCellIsBlank(position));
        } else if (config.hasCharacter(character)) {
          dispatch(boardSlice.actions.changeCellValue({ ...position, value: character }));
          onMoveFocus('forward');
        }
      },
    });
  }, [changeActiveIndex, dispatch, config, lastDirectionRef, onDirectionToggle]);

  return [
    { lastDirection, refs },
    { onDirectionToggle, onFocus, onKeyDown },
  ];
};

export default useGrid;
