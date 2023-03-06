import { autoUpdate, FloatingPortal, offset, shift, useFloating, useMergeRefs } from '@floating-ui/react';
import classNames from 'classnames';
import {
  CSSProperties,
  FocusEventHandler,
  FunctionComponent,
  MouseEventHandler,
  TouchEventHandler,
  useEffect,
  useRef,
  useState,
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

// eslint-disable-next-line max-statements
const Board: FunctionComponent<Props> = ({ cellSize, className }) => {
  const dispatch = useDispatch();
  const rows = useTypedSelector(selectRowsWithCandidate);
  const board = useTypedSelector(selectBoard);
  const boardRef = useRef<HTMLDivElement>(null);
  const [actionsMeasureRef, { width: actionsWidth }] = useMeasure<HTMLDivElement>();
  const [
    { activePosition, direction, focusPosition, inputRef, tileRefs },
    { onChange, onDirectionToggle, onFocus, onKeyDown, onPaste },
  ] = useGrid(rows);
  const cell = rows[activePosition.y][activePosition.x];
  const [showActions, setShowActions] = useState(false);
  const [transition, setTransition] = useState<CSSProperties['transition']>(TRANSITION);

  const floatingActions = useFloating({
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

  const actionsRef = useMergeRefs([actionsMeasureRef, floatingActions.refs.setFloating]);

  const setFocus = (clientX: number, clientY: number) => {
    if (!boardRef.current) {
      return;
    }

    inputRef.current?.focus();
    const boardRect = boardRef.current.getBoundingClientRect();
    const newX = Math.floor((clientX - boardRect.left) / (cellSize + BORDER_WIDTH));
    const newY = Math.floor((clientY - boardRect.top) / (cellSize + BORDER_WIDTH));
    const isFirstFocus = !showActions;
    const originalTransition = floatingActions.refs.floating.current?.style.transition || '';
    const newTileElement = tileRefs[newY][newX].current;

    if (isFirstFocus) {
      setTransition('none');
    }

    floatingActions.refs.setReference(newTileElement);
    onFocus(newX, newY);
    setShowActions(true);

    if (isFirstFocus) {
      setTimeout(() => {
        setTransition(originalTransition);
      }, 0);
    }
  };

  const handleBlur: FocusEventHandler = (event) => {
    const eventComesFromActions = floatingActions.refs.floating.current?.contains(event.relatedTarget);
    const eventComesFromBoard = boardRef.current?.contains(event.relatedTarget);
    const isLocalEvent = eventComesFromActions || eventComesFromBoard;

    if (!isLocalEvent) {
      setShowActions(false);
    }
  };

  const handleDirectionToggle = () => {
    onDirectionToggle();
  };

  const handleFocus = () => {
    setShowActions(true);
  };

  const handleMouseDown: MouseEventHandler = (event) => {
    event.preventDefault(); // prevent gaining focus before giving it to input
    setFocus(event.clientX, event.clientY);
  };

  const handleToggleBlank = () => {
    dispatch(boardSlice.actions.toggleCellIsBlank(cell));
  };

  const handleToggleFilterCell = () => {
    dispatch(cellFilterSlice.actions.toggle(cell));
  };

  const handleTouchStart: TouchEventHandler = (event) => {
    if (!boardRef.current || event.targetTouches.length === 0) {
      return;
    }

    const touch = event.targetTouches.item(0);
    setFocus(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    const newTileElement = tileRefs[activePosition.y][activePosition.x].current;
    floatingActions.refs.setReference(newTileElement);
  }, [activePosition]);

  return (
    <>
      <div className={classNames(styles.boardContainer, className)}>
        <BoardPure
          cellSize={cellSize}
          center={board.center}
          ref={boardRef}
          rows={rows}
          tabIndex={0}
          tileRefs={tileRefs}
          onTouchStart={handleTouchStart}
          onMouseDown={handleMouseDown}
        />

        <Input
          activePosition={activePosition}
          className={styles.input}
          focusPosition={focusPosition}
          ref={inputRef}
          onBlur={handleBlur}
          onChange={onChange}
          onFocus={handleFocus}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
        />
      </div>

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
            position: floatingActions.strategy,
            top: floatingActions.y ?? 0,
            left: floatingActions.x ?? 0,
            transition,
            opacity: showActions ? 1 : 0,
            pointerEvents: showActions ? 'auto' : 'none',
            userSelect: showActions ? 'auto' : 'none',
            visibility: floatingActions.x === null || floatingActions.y === null ? 'hidden' : 'visible',
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
