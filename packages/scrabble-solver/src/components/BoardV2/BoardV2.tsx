import { EMPTY_CELL } from '@scrabble-solver/constants';
import {
  ChangeEventHandler,
  FocusEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
  MouseEventHandler,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';

import { extractCharacters } from 'lib';
import { boardSlice, selectBoard, selectConfig, selectRowsWithCandidate, useTypedSelector } from 'state';

import { Point } from '../Board/types';

import styles from './BoardV2.module.scss';

// import BoardPure from './BoardPure';
// import { useGrid } from './hooks';

interface Props {
  cellSize: number;
  className?: string;
  // innerRef?: Ref<HTMLInputElement>;
}

const BoardV2: FunctionComponent<Props> = ({ cellSize, className /* innerRef */ }) => {
  const dispatch = useDispatch();
  const rows = useTypedSelector(selectRowsWithCandidate);
  const board = useTypedSelector(selectBoard);
  const config = useTypedSelector(selectConfig);
  // const [{ lastDirection, refs }, { onDirectionToggle, onFocus, onKeyDown }] = useGrid(rows);

  const ref = useRef<HTMLInputElement>(null);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [direction, setDirection] = useState<'vertical' | 'horizontal'>('horizontal');
  const [focusedCell, setFocusedCell] = useState<Point | null>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.setSelectionRange(index, index + 1, 'forward');
    }
  }, [index, ref, value]);

  const refreshValue = useCallback(() => {
    if (!ref.current || !focusedCell) {
      return;
    }

    const { x, y } = focusedCell;
    const cells = direction === 'horizontal' ? board.getRow(y) : board.getColumn(x);
    const newValue = cells.map((cell) => (cell.hasTile() ? cell.toString() : ' ')).join('');
    // const newValue = cells.map((cell) => (cell.hasTile() ? cell.toString() : '')).join('');
    ref.current.value = newValue;
    setValue(newValue);
    setIndex(direction === 'horizontal' ? x : y);
  }, [board, direction, focusedCell, ref, setValue]);

  useLayoutEffect(() => {
    if (!ref.current || !focusedCell) {
      return;
    }

    refreshValue();
  }, [focusedCell, refreshValue, ref]);

  const moveFocus = (direction: 'up' | 'down' | 'left' | 'right') => {
    setFocusedCell((cell) => {
      if (!cell) {
        const x = Math.floor(config.boardWidth / 2);
        const y = Math.floor(config.boardHeight / 2);
        return { x, y };
      }

      let { x: newX, y: newY } = cell;

      if (direction === 'up') {
        --newY;
      }

      if (direction === 'down') {
        ++newY;
      }

      if (direction === 'left') {
        --newX;
      }

      if (direction === 'right') {
        ++newX;
      }

      const x = Math.min(Math.max(0, newX), config.boardWidth - 1);
      const y = Math.min(Math.max(0, newY), config.boardHeight - 1);
      return { x, y };
    });
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    setFocusedCell(null);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value.toLocaleLowerCase();
    // updateValue(value);
    setValue(value);

    if (!focusedCell) {
      return;
    }

    const { x, y } = focusedCell;
    const characters = extractCharacters(config, value);

    characters.forEach((character, index) => {
      if (direction === 'horizontal') {
        dispatch(boardSlice.actions.changeCellValue({ x: index, y, value: character }));
      } else {
        dispatch(boardSlice.actions.changeCellValue({ x, y: index, value: character }));
      }
    });

    moveFocus(direction === 'horizontal' ? 'right' : 'down');
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveFocus('down');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveFocus('up');
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveFocus('left');
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveFocus('right');
    } else if (event.key === ' ') {
      // TODO: blank toggling
      event.preventDefault();
    } else if (event.key === 'Backspace') {
      event.preventDefault();

      if (focusedCell) {
        dispatch(boardSlice.actions.changeCellValue({ ...focusedCell, value: EMPTY_CELL }));
        moveFocus(direction === 'horizontal' ? 'left' : 'up');
      }
    } else if (event.key === 'Delete') {
      event.preventDefault();

      if (focusedCell) {
        dispatch(boardSlice.actions.changeCellValue({ ...focusedCell, value: EMPTY_CELL }));
        moveFocus(direction === 'horizontal' ? 'right' : 'down');
      }
    }
  };

  const handleFocus: FocusEventHandler<HTMLInputElement> = (event) => {};

  const handleMouseDown: MouseEventHandler<HTMLInputElement> = (event) => {
    if (!ref.current) {
      return;
    }

    const { top, left, width, height } = event.currentTarget.getBoundingClientRect();

    if (event.clientX < left || event.clientY < top) {
      return;
    }

    const x = Math.floor(((event.clientX - left) * config.boardWidth) / width);
    const y = Math.floor(((event.clientY - top) * config.boardHeight) / height);

    ref.current.focus();
    setFocusedCell({ x, y });
    event.preventDefault();
  };

  return (
    <>
      <input
        className={styles.input}
        maxLength={direction === 'horizontal' ? config.boardWidth : config.boardHeight}
        ref={ref}
        value={value}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
      />

      {ref.current && focusedCell && (
        <div
          className={styles.focusedCell}
          style={{
            top: (focusedCell.y * ref.current.getBoundingClientRect().height) / config.boardHeight,
            left: (focusedCell.x * ref.current.getBoundingClientRect().width) / config.boardWidth,
            height: ref.current.getBoundingClientRect().height / config.boardHeight,
            width: ref.current.getBoundingClientRect().width / config.boardWidth,
          }}
        />
      )}
    </>
  );
};

export default BoardV2;
