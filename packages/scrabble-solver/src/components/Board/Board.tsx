/* eslint-disable max-statements */

import { FloatingPortal, ReferenceType } from '@floating-ui/react';
import classNames from 'classnames';
import { CSSProperties, FocusEventHandler, FunctionComponent, useCallback, useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useDispatch } from 'react-redux';

import { useAppLayout } from 'hooks';
import { TRANSITION } from 'parameters';
import { boardSlice, cellFilterSlice, selectInputMode, selectRowsWithCandidate, useTypedSelector } from 'state';

import styles from './Board.module.scss';
import BoardPure from './BoardPure';
import { Actions, InputPrompt } from './components';
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
  const [showInputPrompt, setShowInputPrompt] = useState(false);
  const [transition, setTransition] = useState<CSSProperties['transition']>(TRANSITION);
  const inputRef = inputRefs[activeIndex.y][activeIndex.x];
  const cell = rows[activeIndex.y][activeIndex.x];
  const floatingActions = useFloatingActions('top-end');
  const floatingInputPrompt = useFloatingActions('top');
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

  const updateFloatingReference = useCallback(
    (newReference: ReferenceType | null) => {
      floatingActions.refs.setReference(newReference);
      floatingFocus.refs.setReference(newReference);
      floatingInputPrompt.refs.setReference(newReference);
    },
    [floatingActions.refs, floatingFocus.refs, floatingInputPrompt.refs],
  );

  const handleFocus: typeof onFocus = useCallback(
    (newX, newY) => {
      const isFirstFocus = !hasFocus;
      const originalTransition = floatingActions.refs.floating.current?.style.transition || '';
      const newInputRef = inputRefs[newY][newX].current;
      const newTileElement = newInputRef?.parentElement || null;

      updateFloatingReference(newTileElement);
      onFocus(newX, newY);
      setHasFocus(true);
      setShowInputPrompt(false);

      if (isFirstFocus) {
        setTransition('none');

        setTimeout(() => {
          setTransition(originalTransition);
        }, 0);
      }
    },
    [floatingActions.refs.floating, hasFocus, inputRefs, onFocus, updateFloatingReference],
  );

  const handleEnterWord = useCallback(() => {
    setShowInputPrompt(true);
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
    ignoreClass: [styles.floating],
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
          className={classNames(styles.floating, styles.focus, {
            [styles.shown]: hasFocus,
          })}
          ref={floatingFocus.refs.setFloating}
          style={{
            position: floatingFocus.strategy,
            top: floatingFocus.y ? floatingFocus.y + cellSize : 0,
            left: floatingFocus.x ?? 0,
            width: cellSize,
            height: cellSize,
            opacity: hasFocus ? 1 : 0,
            visibility: floatingFocus.x === null || floatingFocus.y === null ? 'hidden' : 'visible',
            transition,
          }}
          tabIndex={0}
        />

        <Actions
          cell={cell}
          className={classNames(styles.floating, {
            [styles.shown]: hasFocus && !showInputPrompt,
          })}
          direction={direction}
          disabled={!hasFocus || showInputPrompt}
          ref={floatingActions.refs.setFloating}
          style={{
            position: floatingActions.strategy,
            top: floatingActions.y ?? 0,
            left: floatingActions.x ?? 0,
            opacity: hasFocus && !showInputPrompt ? 1 : 0,
            visibility: floatingActions.x === null || floatingActions.y === null ? 'hidden' : 'visible',
            transition,
          }}
          onDirectionToggle={handleToggleDirection}
          onEnterWord={handleEnterWord}
          onToggleBlank={handleToggleBlank}
          onToggleFilterCell={handleToggleFilterCell}
        />

        <InputPrompt
          className={classNames(styles.floating, {
            [styles.shown]: hasFocus && showInputPrompt,
          })}
          direction={direction}
          disabled={!hasFocus || !showInputPrompt}
          ref={floatingInputPrompt.refs.setFloating}
          style={{
            position: floatingInputPrompt.strategy,
            top: floatingInputPrompt.y ?? 0,
            left: floatingInputPrompt.x ?? 0,
            opacity: hasFocus && showInputPrompt ? 1 : 0,
            visibility: floatingInputPrompt.x === null || floatingInputPrompt.y === null ? 'hidden' : 'visible',
            transition,
          }}
          onDirectionToggle={handleToggleDirection}
        />
      </FloatingPortal>
    </>
  );
};

export default Board;
