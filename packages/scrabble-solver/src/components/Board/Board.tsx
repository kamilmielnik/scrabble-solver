/* eslint-disable max-lines */
import { autoUpdate, FloatingPortal, offset, shift, useFloating, useMergeRefs } from '@floating-ui/react';
import classNames from 'classnames';
import {
  CSSProperties,
  FocusEventHandler,
  FunctionComponent,
  MouseEventHandler,
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
  const [hasFocus, setHasFocus] = useState(false);
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

  const floatingFocus = useFloating({
    placement: 'top-start',
    whileElementsMounted: autoUpdate,
  });

  const floatingStyle: CSSProperties = {
    transition,
    opacity: hasFocus ? 1 : 0,
    pointerEvents: hasFocus ? 'auto' : 'none',
    userSelect: hasFocus ? 'auto' : 'none',
    visibility: floatingFocus.x === null || floatingActions.y === null ? 'hidden' : 'visible',
  };

  const actionsRef = useMergeRefs([actionsMeasureRef, floatingActions.refs.setFloating]);

  const setFocus = (clientX: number, clientY: number) => {
    if (!boardRef.current) {
      return;
    }

    const boardRect = boardRef.current.getBoundingClientRect();
    const newX = Math.floor((clientX - boardRect.left) / (cellSize + BORDER_WIDTH));
    const newY = Math.floor((clientY - boardRect.top) / (cellSize + BORDER_WIDTH));
    const isFirstFocus = !hasFocus;
    const originalTransition = floatingActions.refs.floating.current?.style.transition || '';
    const newTileElement = tileRefs[newY][newX].current;

    if (isFirstFocus) {
      setTransition('none');
    }

    floatingActions.refs.setReference(newTileElement);
    floatingFocus.refs.setReference(newTileElement);
    onFocus(newX, newY);
    setHasFocus(true);

    if (isFirstFocus) {
      setTimeout(() => {
        setTransition(originalTransition);
      }, 0);
    }
  };

  const handleBlur: FocusEventHandler = (event) => {
    const eventComesFromActions = floatingActions.refs.floating.current?.contains(event.relatedTarget);
    const eventComesFromBoard = boardRef.current?.contains(event.relatedTarget);
    const eventComesFromFocus = floatingFocus.refs.floating.current?.contains(event.relatedTarget);
    const isLocalEvent = eventComesFromActions || eventComesFromBoard || eventComesFromFocus;

    if (!isLocalEvent) {
      setHasFocus(false);
    }
  };

  const handleClick: MouseEventHandler = (event) => {
    event.preventDefault(); // prevent gaining focus before giving it to input
    setFocus(event.clientX, event.clientY);
  };

  const handleDirectionToggle = () => {
    onDirectionToggle();
  };

  const handleFocus = () => {
    setHasFocus(true);
  };

  const handleToggleBlank = () => {
    dispatch(boardSlice.actions.toggleCellIsBlank(cell));
  };

  const handleToggleFilterCell = () => {
    dispatch(cellFilterSlice.actions.toggle(cell));
  };

  useEffect(() => {
    const newTileElement = tileRefs[activePosition.y][activePosition.x].current;
    floatingActions.refs.setReference(newTileElement);
    floatingFocus.refs.setReference(newTileElement);
  }, [activePosition, floatingActions.refs, floatingFocus.refs]);

  return (
    <>
      <div className={classNames(styles.boardContainer, className)}>
        <BoardPure
          cellSize={cellSize}
          center={board.center}
          ref={boardRef}
          rows={rows}
          tileRefs={tileRefs}
          onClick={handleClick}
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
        <div
          className={classNames(styles.focus, {
            [styles.shown]: hasFocus,
          })}
          ref={floatingFocus.refs.setFloating}
          style={{
            ...floatingStyle,
            position: floatingFocus.strategy,
            top: floatingFocus.y ? floatingFocus.y + cellSize : 0,
            left: floatingFocus.x ?? 0,
            width: cellSize,
            height: cellSize,
          }}
          tabIndex={0}
        />

        <Actions
          cell={cell}
          className={classNames(styles.actions, {
            [styles.shown]: hasFocus,
          })}
          disabled={!hasFocus}
          direction={direction}
          ref={actionsRef}
          style={{
            ...floatingStyle,
            position: floatingActions.strategy,
            top: floatingActions.y ?? 0,
            left: floatingActions.x ?? 0,
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
