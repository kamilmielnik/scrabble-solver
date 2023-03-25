/* eslint-disable max-statements */

import { autoUpdate, FloatingPortal, offset, shift, useFloating } from '@floating-ui/react';
import classNames from 'classnames';
import { CSSProperties, FocusEventHandler, FunctionComponent, useCallback, useMemo, useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
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
  const [hasFocus, setHasFocus] = useState(false);
  const [transition, setTransition] = useState<CSSProperties['transition']>(TRANSITION);
  const inputRef = inputRefs[activeIndex.y][activeIndex.x];
  const cell = rows[activeIndex.y][activeIndex.x];

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

  const handleBlur: FocusEventHandler = useCallback(
    (event) => {
      const eventComesFromActions = floatingActions.refs.floating.current?.contains(event.relatedTarget);
      const eventComesFromBoard = event.currentTarget.contains(event.relatedTarget);
      const eventComesFromFocus = floatingFocus.refs.floating.current?.contains(event.relatedTarget);
      const isLocalEvent = eventComesFromActions || eventComesFromBoard || eventComesFromFocus;

      if (!isLocalEvent) {
        setHasFocus(false);
      }
    },
    [floatingActions.refs.floating, floatingFocus.refs.floating],
  );

  const handleDirectionToggle = useCallback(() => {
    inputRef.current?.focus();
    onDirectionToggle();
  }, [inputRef, onDirectionToggle]);

  const handleFocus: typeof onFocus = useCallback(
    (newX, newY) => {
      const isFirstFocus = !hasFocus;
      const originalTransition = floatingActions.refs.floating.current?.style.transition || '';
      const newInputRef = inputRefs[newY][newX].current;
      const newTileElement = newInputRef?.parentElement || null;

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
    },
    [
      floatingActions.refs.floating,
      floatingActions.refs.setReference,
      floatingFocus.refs.setReference,
      hasFocus,
      inputRefs,
      onFocus,
    ],
  );

  const handleToggleBlank = useCallback(() => {
    inputRef.current?.focus();
    dispatch(boardSlice.actions.toggleCellIsBlank(cell));
  }, [cell, dispatch, inputRef]);

  const handleToggleFilterCell = useCallback(() => {
    inputRef.current?.focus();
    dispatch(cellFilterSlice.actions.toggle(cell));
  }, [cell, dispatch, inputRef]);

  const ref = useOnclickOutside(() => setHasFocus(false), {
    ignoreClass: [styles.focus, styles.actions],
  });

  return (
    <>
      <BoardPure
        className={className}
        cellSize={cellSize}
        inputRefs={inputRefs}
        ref={ref}
        rows={rows}
        style={boardStyle}
        onBlur={handleBlur}
        onChange={onChange}
        onFocus={handleFocus}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
      />

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
          ref={floatingActions.refs.setFloating}
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
