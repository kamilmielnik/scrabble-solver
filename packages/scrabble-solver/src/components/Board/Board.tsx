import { autoUpdate, FloatingPortal, offset, shift, useFloating, useMergeRefs } from '@floating-ui/react';
import classNames from 'classnames';
import { CSSProperties, FocusEventHandler, FunctionComponent, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import useMeasure from 'react-use-measure';

import { BOARD_CELL_ACTIONS_OFFSET, TRANSITION } from 'parameters';
import { boardSlice, cellFilterSlice, selectBoard, selectRowsWithCandidate, useTypedSelector } from 'state';

import styles from './Board.module.scss';
import BoardPure from './BoardPure';
import { Actions } from './components';
import { useGrid } from './hooks';

interface Props {
  cellSize: number;
  className?: string;
}

const Board: FunctionComponent<Props> = ({ cellSize, className }) => {
  const dispatch = useDispatch();
  const rows = useTypedSelector(selectRowsWithCandidate);
  const board = useTypedSelector(selectBoard);
  const [actionsMeasureRef, { width: actionsWidth }] = useMeasure();
  const [{ activeIndex, direction, inputRefs }, { onChange, onDirectionToggle, onFocus, onKeyDown, onPaste }] =
    useGrid(rows);
  const inputRef = inputRefs[activeIndex.y][activeIndex.x];
  const cell = rows[activeIndex.y][activeIndex.x];
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

  const handleBlur: FocusEventHandler = useCallback(
    (event) => {
      const eventComesFromActions = refs.floating.current?.contains(event.relatedTarget);
      const eventComesFromBoard = event.currentTarget.contains(event.relatedTarget);
      const isLocalEvent = eventComesFromActions || eventComesFromBoard;

      if (!isLocalEvent) {
        setShowActions(false);
      }
    },
    [refs.floating],
  );

  const handleDirectionToggle = useCallback(() => {
    inputRef.current?.focus();
    onDirectionToggle();
  }, [inputRef, onDirectionToggle]);

  const handleFocus: typeof onFocus = useCallback(
    (newX, newY) => {
      const isFirstFocus = !showActions;
      const originalTransition = refs.floating.current?.style.transition || '';
      const newInputRef = inputRefs[newY][newX].current;
      const newTileElement = newInputRef?.parentElement || null;

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
    },
    [inputRefs, onFocus, refs.floating, refs.setReference, showActions],
  );

  const handleToggleBlank = useCallback(() => {
    inputRef.current?.focus();
    dispatch(boardSlice.actions.toggleCellIsBlank(cell));
  }, [cell, dispatch, inputRef]);

  const handleToggleFilterCell = useCallback(() => {
    inputRef.current?.focus();
    dispatch(cellFilterSlice.actions.toggle(cell));
  }, [cell, dispatch, inputRef]);

  return (
    <>
      <BoardPure
        className={className}
        cellSize={cellSize}
        center={board.center}
        inputRefs={inputRefs}
        rows={rows}
        onBlur={handleBlur}
        onChange={onChange}
        onFocus={handleFocus}
        onKeyDown={onKeyDown}
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
