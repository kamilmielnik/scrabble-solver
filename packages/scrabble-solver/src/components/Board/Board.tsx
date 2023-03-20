import { autoUpdate, FloatingPortal, offset, shift, useFloating } from '@floating-ui/react';
import classNames from 'classnames';
import { CSSProperties, FocusEventHandler, FunctionComponent, useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAppLayout } from 'hooks';
import { getTileSizes } from 'lib';
import { BOARD_CELL_ACTIONS_OFFSET, TRANSITION } from 'parameters';
import { boardSlice, cellFilterSlice, selectConfig, selectRowsWithCandidate, useTypedSelector } from 'state';

import styles from './Board.module.scss';
import BoardPure from './BoardPure';
import { Actions } from './components';
import { useBackgroundImage, useGrid } from './hooks';

interface Props {
  className?: string;
}

const Board: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const rows = useTypedSelector(selectRowsWithCandidate);
  const config = useTypedSelector(selectConfig);
  const { actionsWidth, cellSize } = useAppLayout();
  const { tileFontSize } = getTileSizes(cellSize);

  const [{ activeIndex, direction, inputRefs }, { onChange, onDirectionToggle, onFocus, onKeyDown, onPaste }] =
    useGrid(rows);
  const backgroundImage = useBackgroundImage();
  const boardStyle = useMemo<CSSProperties>(
    () => ({
      backgroundImage,
      fontSize: tileFontSize,
      gridTemplateColumns: `repeat(${config.boardWidth}, 1fr)`,
      gridTemplateRows: `repeat(${config.boardHeight}, 1fr)`,
    }),
    [backgroundImage, config.boardHeight, config.boardWidth, tileFontSize],
  );
  const [showActions, setShowActions] = useState(false);
  const [transition, setTransition] = useState<CSSProperties['transition']>(TRANSITION);
  const inputRef = inputRefs[activeIndex.y][activeIndex.x];
  const cell = rows[activeIndex.y][activeIndex.x];

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
        inputRefs={inputRefs}
        rows={rows}
        style={boardStyle}
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
          ref={refs.setFloating}
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
