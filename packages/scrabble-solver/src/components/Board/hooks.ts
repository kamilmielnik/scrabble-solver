import { createRef, KeyboardEventHandler, RefObject, useCallback, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';

import { State } from 'state';
import { createKeyboardNavigation } from 'utils';

import { createGridOf } from './lib';
import { createSelectBonus, createSelectCharacterPoints, selectRowsWithCandidate } from './selectors';

export const useRows = () => useSelector<State>(selectRowsWithCandidate);

export const useBonus = (cell) => {
  const selectBonus = useMemo(() => createSelectBonus(), []);
  return useSelector<State>((state) => selectBonus(state, cell));
};

export const useCharacterPoints = (cell) => {
  const selectCharacterPoints = useMemo(() => createSelectCharacterPoints(), []);
  return useSelector<State>((state) => selectCharacterPoints(state, cell));
};

interface State {
  refs: RefObject<{ focus: () => void }>[][];
}

interface Actions {
  onFocus: (x: number, y: number) => void;
  onKeyDown: KeyboardEventHandler;
  onMoveFocus: () => void;
}

export const useGrid = (width: number, height: number): [State, Actions] => {
  const refs = useMemo(
    () => createGridOf<RefObject<{ focus: () => void }>>(width, height, () => createRef()),
    [width, height],
  );
  const activeIndex = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const lastDirectionRef = useRef<'horizontal' | 'vertical'>('horizontal');

  const changeActiveIndex = useCallback(
    (offsetX, offsetY) => {
      const x = Math.min(Math.max(activeIndex.current.x + offsetX, 0), width - 1);
      const y = Math.min(Math.max(activeIndex.current.y + offsetY, 0), height - 1);
      activeIndex.current = { x, y };
      refs[y][x].current?.focus();
    },
    [activeIndex, refs, width, height],
  );

  const onFocus = useCallback(
    (x, y) => {
      activeIndex.current = { x, y };
    },
    [activeIndex],
  );

  const onMoveFocus = useCallback(() => {
    if (lastDirectionRef.current === 'horizontal') {
      changeActiveIndex(1, 0);
    } else if (lastDirectionRef.current === 'vertical') {
      changeActiveIndex(0, 1);
    }
  }, [changeActiveIndex]);

  const onKeyDown = useMemo(
    () =>
      createKeyboardNavigation({
        onArrowDown: () => {
          changeActiveIndex(0, 1);
          lastDirectionRef.current = 'vertical';
        },
        onArrowLeft: () => {
          changeActiveIndex(-1, 0);
          lastDirectionRef.current = 'horizontal';
        },
        onArrowRight: () => {
          changeActiveIndex(1, 0);
          lastDirectionRef.current = 'horizontal';
        },
        onArrowUp: () => {
          changeActiveIndex(0, -1);
          lastDirectionRef.current = 'vertical';
        },
      }),
    [changeActiveIndex],
  );

  return [{ refs }, { onFocus, onKeyDown, onMoveFocus }];
};
