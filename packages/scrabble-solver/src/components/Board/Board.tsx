/* eslint-disable max-statements */

import { FloatingPortal } from '@floating-ui/react';
import classNames from 'classnames';
import { CSSProperties, FocusEventHandler, FunctionComponent, useCallback, useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useDispatch } from 'react-redux';

import { useAppLayout } from 'hooks';
import { TRANSITION } from 'parameters';
import { boardSlice, cellFilterSlice, selectInputMode, selectRowsWithCandidate, useTypedSelector } from 'state';

import styles from './Board.module.scss';
import BoardPure from './BoardPure';
import { Actions } from './components';
import { useBoardStyle, useFloatingActions, useFloatingFocus, useGrid } from './hooks';

interface Props {
  className?: string;
}

const Board: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const rows = useTypedSelector(selectRowsWithCandidate);
  const inputMode = useTypedSelector(selectInputMode);
  const { cellSize } = useAppLayout();
  const [{ activeIndex, direction, inputRefs }, { onChange, onDirectionToggle, onFocus, onKeyDown, onPaste }] =
    useGrid(rows);
  const boardStyle = useBoardStyle();
  const [hasFocus, setHasFocus] = useState(false);
  const [transition, setTransition] = useState<CSSProperties['transition']>(TRANSITION);
  const inputRef = inputRefs[activeIndex.y][activeIndex.x];
  const cell = rows[activeIndex.y][activeIndex.x];
  const floatingActions = useFloatingActions();
  const floatingFocus = useFloatingFocus();

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

  const handleFocus: typeof onFocus = useCallback(
    (newX, newY) => {
      const isFirstFocus = !hasFocus;
      const originalTransition = floatingActions.refs.floating.current?.style.transition || '';
      const newInputRef = inputRefs[newY][newX].current;
      const newTileElement = newInputRef?.parentElement || null;

      floatingActions.refs.setReference(newTileElement);
      floatingFocus.refs.setReference(newTileElement);
      onFocus(newX, newY);
      setHasFocus(true);

      if (isFirstFocus) {
        setTransition('none');

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

  const handleEnterWord = useCallback(() => {
    throw new Error('Not implemented');
  }, []);

  const handleToggleBlank = useCallback(() => {
    if (inputMode === 'keyboard') {
      inputRef.current?.focus();
    }

    dispatch(boardSlice.actions.toggleCellIsBlank(cell));
  }, [cell, dispatch, inputMode, inputRef]);

  const handleToggleDirection = useCallback(() => {
    if (inputMode === 'keyboard') {
      inputRef.current?.focus();
    }

    onDirectionToggle();
  }, [inputMode, inputRef, onDirectionToggle]);

  const handleToggleFilterCell = useCallback(() => {
    if (inputMode === 'keyboard') {
      inputRef.current?.focus();
    }

    dispatch(cellFilterSlice.actions.toggle(cell));
  }, [cell, dispatch, inputMode, inputRef]);

  const ref = useOnclickOutside(() => setHasFocus(false), {
    ignoreClass: [styles.focus, styles.actions],
  });

  const floatingStyle: CSSProperties = {
    transition,
    opacity: hasFocus ? 1 : 0,
    pointerEvents: hasFocus ? 'auto' : 'none',
    userSelect: hasFocus ? 'auto' : 'none',
    visibility:
      floatingFocus.x === null || floatingFocus.y === null || floatingActions.x === null || floatingActions.y === null
        ? 'hidden'
        : 'visible',
  };

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
          direction={direction}
          disabled={!hasFocus}
          ref={floatingActions.refs.setFloating}
          style={{
            ...floatingStyle,
            position: floatingActions.strategy,
            top: floatingActions.y ?? 0,
            left: floatingActions.x ?? 0,
          }}
          onDirectionToggle={handleToggleDirection}
          onEnterWord={handleEnterWord}
          onToggleBlank={handleToggleBlank}
          onToggleFilterCell={handleToggleFilterCell}
        />
      </FloatingPortal>
    </>
  );
};

export default Board;
