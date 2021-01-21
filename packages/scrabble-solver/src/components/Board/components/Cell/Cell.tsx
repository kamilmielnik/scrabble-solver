import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Cell as CellModel } from '@scrabble-solver/types';
import React, { FunctionComponent, KeyboardEventHandler, RefObject, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { createKeyboardNavigation, getTileSizes, isCtrl } from 'lib';
import { boardSlice, selectBonus, selectConfig, useTranslate, useTypedSelector } from 'state';

import CellPure from './CellPure';

interface Props {
  cell: CellModel;
  className?: string;
  direction: 'horizontal' | 'vertical';
  inputRef: RefObject<HTMLInputElement>;
  size: number;
  onDirectionToggle: () => void;
  onFocus: (x: number, y: number) => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onMoveFocus: (direction: 'backward' | 'forward') => void;
}

const Cell: FunctionComponent<Props> = ({
  cell,
  className,
  direction,
  inputRef,
  size,
  onDirectionToggle,
  onFocus,
  onKeyDown,
  onMoveFocus,
}) => {
  const { tile, x, y } = cell;
  const dispatch = useDispatch();
  const translate = useTranslate();
  const config = useTypedSelector(selectConfig);
  const bonus = useTypedSelector((state) => selectBonus(state, cell));
  const { tileFontSize } = getTileSizes(size);
  const isEmpty = tile.character === EMPTY_CELL;
  const style = useMemo(() => ({ fontSize: tileFontSize }), [tileFontSize]);

  const handleFocus = useCallback(() => onFocus(x, y), [x, y, onFocus]);

  const handleKeyDown = useMemo(() => {
    return createKeyboardNavigation({
      onDelete: () => dispatch(boardSlice.actions.changeCellValue({ value: EMPTY_CELL, x, y })),
      onBackspace: () => dispatch(boardSlice.actions.changeCellValue({ value: EMPTY_CELL, x, y })),
      onKeyDown: (event) => {
        const character = event.key.toLowerCase();
        const isTogglingBlank = isCtrl(event) && character === 'b';

        if (isTogglingBlank) {
          dispatch(boardSlice.actions.toggleCellIsBlank({ x, y }));
        } else if (config.hasCharacter(character)) {
          dispatch(boardSlice.actions.changeCellValue({ value: character, x, y }));
          onMoveFocus('forward');
        }

        onKeyDown(event);
      },
    });
  }, [x, y, config, dispatch, onKeyDown, onMoveFocus]);

  const handleToggleBlankClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    dispatch(boardSlice.actions.toggleCellIsBlank({ x, y }));
  }, [dispatch, x, y]);

  const handleDirectionToggleClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    onDirectionToggle();
  }, [onDirectionToggle]);

  return (
    <CellPure
      bonus={bonus}
      cell={cell}
      className={className}
      direction={direction}
      inputRef={inputRef}
      isEmpty={isEmpty}
      size={size}
      style={style}
      tile={tile}
      translate={translate}
      onDirectionToggleClick={handleDirectionToggleClick}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onToggleBlankClick={handleToggleBlankClick}
    />
  );
};

export default Cell;
