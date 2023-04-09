/* eslint-disable max-lines, max-statements */

import { FloatingPortal, ReferenceType } from '@floating-ui/react';
import { EMPTY_CELL } from '@scrabble-solver/constants';
import classNames from 'classnames';
import { CSSProperties, FocusEventHandler, FunctionComponent, useCallback, useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useDispatch } from 'react-redux';

import { useAppLayout } from 'hooks';
import { TRANSITION } from 'parameters';
import {
  boardSlice,
  cellFilterSlice,
  selectFilteredCells,
  selectInputMode,
  selectLocale,
  selectRowsWithCandidate,
  solveSlice,
  useTypedSelector,
} from 'state';

import styles from './Board.module.scss';
import BoardPure from './BoardPure';
import { Actions, InputPrompt } from './components';
import {
  useBoardStyle,
  useFloatingActions,
  useFloatingFocus,
  useFloatingInputPrompt,
  useGrid,
} from './hooks';

interface Props {
  className?: string;
}

const Board: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const locale = useTypedSelector(selectLocale);
  const rows = useTypedSelector(selectRowsWithCandidate);
  const inputMode = useTypedSelector(selectInputMode);
  const filteredCells = useTypedSelector(selectFilteredCells);
  const { cellSize } = useAppLayout();
  const [
    { activeIndex, direction, inputRefs },
    { insertValue, onChange, onDirectionToggle, onFocus, onKeyDown, onPaste },
  ] = useGrid(rows);
  const boardStyle = useBoardStyle();
  const [hasFocus, setHasFocus] = useState(false);
  const [showInputPrompt, setShowInputPrompt] = useState(false);
  const [transition, setTransition] = useState<CSSProperties['transition']>(TRANSITION);
  const inputRef = inputRefs[activeIndex.y][activeIndex.x];
  const cell = rows[activeIndex.y][activeIndex.x];
  const floatingActions = useFloatingActions();
  const floatingInputPrompt = useFloatingInputPrompt();
  const floatingFocus = useFloatingFocus();

  const handleBlur: FocusEventHandler = useCallback(
    (event) => {
      const comesFromActions = floatingActions.refs.floating.current?.contains(event.relatedTarget);
      const comesFromBoard = event.currentTarget.contains(event.relatedTarget);
      const comesFromFocus = floatingFocus.refs.floating.current?.contains(event.relatedTarget);
      const comesFromInputPrompt = floatingInputPrompt.refs.floating.current?.contains(event.relatedTarget);
      const isLocalEvent = comesFromActions || comesFromBoard || comesFromFocus || comesFromInputPrompt;

      if (!isLocalEvent) {
        setHasFocus(false);
      }
    },
    [floatingActions.refs.floating, floatingFocus.refs.floating, floatingInputPrompt.refs.floating],
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

        globalThis.setTimeout(() => {
          setTransition(originalTransition);
        }, 0);
      }
    },
    [floatingActions.refs.floating, hasFocus, inputRefs, onFocus, updateFloatingReference],
  );

  const handleEnterWord = useCallback(() => {
    setShowInputPrompt(true);
  }, []);

  const handleInsertWord = useCallback(
    (word: string) => {
      if (word.trim().length === 0) {
        dispatch(boardSlice.actions.changeCellValue({ ...activeIndex, value: EMPTY_CELL }));
      } else {
        insertValue(activeIndex, word.toLocaleLowerCase(locale));
      }

      setShowInputPrompt(false);
      dispatch(solveSlice.actions.submit());
      setHasFocus(false);
    },
    [activeIndex, dispatch, locale],
  );

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
        filteredCells={filteredCells}
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
            [styles.hidden]: !hasFocus,
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

        {hasFocus && !showInputPrompt && (
          <Actions
            cell={cell}
            className={styles.floating}
            direction={direction}
            ref={floatingActions.refs.setFloating}
            style={{
              position: floatingActions.strategy,
              top: floatingActions.y ?? 0,
              left: floatingActions.x ?? 0,
              transition,
            }}
            onDirectionToggle={handleToggleDirection}
            onEnterWord={handleEnterWord}
            onToggleBlank={handleToggleBlank}
            onToggleFilterCell={handleToggleFilterCell}
          />
        )}

        {hasFocus && showInputPrompt && (
          <InputPrompt
            className={styles.floating}
            direction={direction}
            initialValue={cell.tile.character}
            ref={floatingInputPrompt.refs.setFloating}
            style={{
              position: floatingInputPrompt.strategy,
              top: floatingInputPrompt.y ?? 0,
              left: floatingInputPrompt.x ?? 0,
              transition,
            }}
            onDirectionToggle={handleToggleDirection}
            onSubmit={handleInsertWord}
          />
        )}
      </FloatingPortal>
    </>
  );
};

export default Board;
