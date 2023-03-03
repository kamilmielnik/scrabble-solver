import { autoUpdate, FloatingPortal, offset, shift, useFloating, useMergeRefs } from '@floating-ui/react';
import classNames from 'classnames';
import {
  CSSProperties,
  FocusEventHandler,
  FunctionComponent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState
} from 'react';
import { useDispatch } from 'react-redux';
import { useMeasure } from 'react-use';

import { BOARD_CELL_ACTIONS_OFFSET, BORDER_WIDTH, TRANSITION } from 'parameters';
import { boardSlice, cellFilterSlice, selectBoard, selectRowsWithCandidate, useTypedSelector } from 'state';

import styles from './Board.module.scss';
import BoardPure from './BoardPure';
import { Actions, Input } from './components';
import { useGrid } from './hooks';

interface Props {
  cellSize: number;
  className?: string;
}

const Board: FunctionComponent<Props> = ({ cellSize, className }) => {
  const dispatch = useDispatch();
  const rows = useTypedSelector(selectRowsWithCandidate);
  const board = useTypedSelector(selectBoard);
  const boardRef = useRef<HTMLDivElement>(null);
  const [actionsMeasureRef, { width: actionsWidth }] = useMeasure<HTMLDivElement>();
  const [
    { activePosition, direction, inputRef, tileRefs },
    { onChange, onDirectionToggle, onFocus, onKeyDown, onPaste },
  ] = useGrid(rows);
  const cell = rows[activePosition.y][activePosition.x];
  const [showActions, setShowActions] = useState(false);
  const [transition, setTransition] = useState<CSSProperties['transition']>(TRANSITION);

  const { x, y, strategy, refs } = useFloating({
    middleware: [
      offset({
        mainAxis: -BOARD_CELL_ACTIONS_OFFSET,
        alignmentAxis: BOARD_CELL_ACTIONS_OFFSET - actionsWidth,
      }),
      shift(),
    ],
    placement: 'top-end',
    whileElementsMounted: autoUpdate,
  });

  const actionsRef = useMergeRefs([actionsMeasureRef, refs.setFloating]);

  const handleBlur: FocusEventHandler = (event) => {
    const eventComesFromActions = refs.floating.current?.contains(event.relatedTarget);
    const eventComesFromBoard = event.currentTarget.contains(event.relatedTarget);
    const isLocalEvent = eventComesFromActions || eventComesFromBoard;

    if (!isLocalEvent) {
      setShowActions(false);
    }
  };

  const handleDirectionToggle = () => {
    inputRef.current?.focus();
    onDirectionToggle();
  };

  const handleFocus = () => {
    setShowActions(true);
  };

  const handleMouseDown: MouseEventHandler = (event) => {
    if (!boardRef.current) {
      return;
    }

    const boardRect = boardRef.current.getBoundingClientRect();
    const newX = Math.floor((event.clientX - boardRect.left) / (cellSize + BORDER_WIDTH));
    const newY = Math.floor((event.clientY - boardRect.top) / (cellSize + BORDER_WIDTH));
    const isFirstFocus = !showActions;
    const originalTransition = refs.floating.current?.style.transition || '';
    const newTileElement = tileRefs[newY][newX].current;

    if (isFirstFocus) {
      setTransition('none');
    }

    refs.setReference(newTileElement);
    onFocus(newX, newY);
    setShowActions(true);

    if (isFirstFocus) {
      setTimeout(() => {
        setTransition(originalTransition);
      }, 0);
    }
  };

  const handleToggleBlank = () => {
    inputRef.current?.focus();
    dispatch(boardSlice.actions.toggleCellIsBlank(cell));
  };

  const handleToggleFilterCell = () => {
    inputRef.current?.focus();
    dispatch(cellFilterSlice.actions.toggle(cell));
  };

  useEffect(() => {
    const newTileElement = tileRefs[activePosition.y][activePosition.x].current;
    refs.setReference(newTileElement);
  }, [activePosition]);

  return (
    <>
      <BoardPure
        className={className}
        cellSize={cellSize}
        center={board.center}
        ref={boardRef}
        rows={rows}
        tileRefs={tileRefs}
      />

      <Input
        activePosition={activePosition}
        className={styles.input}
        onBlur={handleBlur}
        onChange={onChange}
        onFocus={handleFocus}
        onKeyDown={onKeyDown}
        onMouseDown={handleMouseDown}
        onPaste={onPaste}
      />

      <FloatingPortal>
        <Actions
          cell={cell}
          className={classNames(styles.actions, {
            [styles.shown]: showActions,
          })}
          disabled={!showActions}
          direction={direction}
          ref={actionsRef}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            transition,
            opacity: showActions ? 1 : 0,
            pointerEvents: showActions ? 'auto' : 'none',
            userSelect: showActions ? 'auto' : 'none',
            visibility: x === null || y === null ? 'hidden' : 'visible',
          }}
          onDirectionToggle={handleDirectionToggle}
          onToggleBlank={handleToggleBlank}
          onToggleFilterCell={handleToggleFilterCell}
        />
      </FloatingPortal>
    </>
  );
};

export default Board;
