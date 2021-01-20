import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Cell as CellModel } from '@scrabble-solver/types';
import classNames from 'classnames';
import React, { FunctionComponent, KeyboardEventHandler, memo, RefObject, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { arrowDown } from 'icons';
import { createKeyboardNavigation, getTileSizes, isCtrl } from 'lib';
import { boardSlice, selectBonus, selectConfig, useTranslate, useTypedSelector } from 'state';

import SvgIcon from '../../../SvgIcon';
import Tile from '../../../Tile';

import Button from './Button';
import styles from './Cell.module.scss';
import { getBonusClassname } from './lib';

interface Props {
  cell: CellModel;
  className?: string;
  direction: 'horizontal' | 'vertical';
  inputRef: RefObject<HTMLInputElement>;
  size: number;
  onDirectionToggle: () => void;
  onFocus: (x: number, y: number) => void;
  onKeyDown: KeyboardEventHandler;
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

  const handleKeyDown = useMemo(
    () =>
      createKeyboardNavigation({
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
      }),
    [x, y, config, dispatch, onKeyDown, onMoveFocus],
  );

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
    <div
      className={classNames(styles.cell, getBonusClassname(cell, bonus), className, {
        [styles.candidate]: cell.isCandidate(),
      })}
      style={style}
    >
      <Tile
        className={styles.tile}
        character={isEmpty ? undefined : tile.character}
        highlighted={cell.isCandidate()}
        inputRef={inputRef}
        isBlank={tile.isBlank}
        raised={!isEmpty}
        size={size}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      />

      <div className={styles.actions}>
        <Button title={translate('cell.toggle-direction')} onClick={handleDirectionToggleClick}>
          <SvgIcon
            className={classNames(styles.toggleDirection, {
              [styles.right]: direction === 'horizontal',
            })}
            icon={arrowDown}
          />
        </Button>

        {!isEmpty && (
          <Button
            className={classNames({
              [styles.blank]: tile.isBlank,
            })}
            title={tile.isBlank ? translate('cell.set-not-blank') : translate('cell.set-blank')}
            onClick={handleToggleBlankClick}
          >
            B
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(Cell);
