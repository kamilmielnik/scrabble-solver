import {
  ChangeEventHandler,
  FocusEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';

import { selectBoard, selectConfig, selectRowsWithCandidate, useTypedSelector } from 'state';
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
  const rows = useTypedSelector(selectRowsWithCandidate);
  const board = useTypedSelector(selectBoard);
  const config = useTypedSelector(selectConfig);
  // const [{ lastDirection, refs }, { onDirectionToggle, onFocus, onKeyDown }] = useGrid(rows);

  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [focusedCell, setFocusedCell] = useState<Point | null>(null);

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

      return {
        x: Math.min(Math.max(0, newX), config.boardWidth - 1),
        y: Math.min(Math.max(0, newY), config.boardHeight - 1),
      };
    });
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    setFocusedCell(null);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    setValue(value);

    if (!focusedCell) {
      return;
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'ArrowDown') {
      moveFocus('down');
    } else if (event.key === 'ArrowUp') {
      moveFocus('up');
    } else if (event.key === 'ArrowLeft') {
      moveFocus('left');
    } else if (event.key === 'ArrowRight') {
      moveFocus('right');
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

    setFocusedCell({ x, y });
  };

  return (
    <>
      <input
        className={styles.input}
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
