import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Cell as CellModel } from '@scrabble-solver/types';
import classNames from 'classnames';
import {
  ChangeEventHandler,
  FocusEventHandler,
  FunctionComponent,
  MouseEventHandler,
  RefObject,
  TouchEventHandler,
  useCallback,
} from 'react';

import {
  selectCellIsValid,
  selectConfig,
  selectInputMode,
  selectLocale,
  selectTilePoints,
  useTranslate,
  useTypedSelector,
} from 'state';

import Tile from '../../../Tile';

import styles from './Cell.module.scss';

interface Props {
  cell: CellModel;
  cellBottom?: CellModel;
  cellLeft?: CellModel;
  cellRight?: CellModel;
  cellTop?: CellModel;
  className?: string;
  inputRef: RefObject<HTMLInputElement | null>;
  size: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onFocus: (x: number, y: number) => void;
}

const Cell: FunctionComponent<Props> = ({
  cell,
  cellBottom,
  cellLeft,
  cellRight,
  cellTop,
  className,
  inputRef,
  size,
  onChange,
  onFocus,
}) => {
  const { tile, x, y } = cell;
  const translate = useTranslate();
  const locale = useTypedSelector(selectLocale);
  const config = useTypedSelector(selectConfig);
  const inputMode = useTypedSelector(selectInputMode);
  const points = useTypedSelector((state) => selectTilePoints(state, cell.tile));
  const isValid = useTypedSelector((state) => selectCellIsValid(state, cell));
  const isEmpty = tile.character === EMPTY_CELL;

  const handleFocus: FocusEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (inputMode === 'touchscreen') {
        event.preventDefault();
        event.target.blur();
      }

      onFocus(x, y);
    },
    [inputMode, onFocus, x, y],
  );

  const handleMouseDown: MouseEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (inputMode === 'touchscreen') {
        event.preventDefault();
      }

      onFocus(x, y);
    },
    [inputMode, onFocus, x, y],
  );

  const handleTouchStart: TouchEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (inputMode === 'touchscreen') {
        event.preventDefault();
      }

      onFocus(x, y);
    },
    [inputMode, onFocus, x, y],
  );

  return (
    <Tile
      aria-label={translate('cell.tile.location', {
        x: (x + 1).toLocaleString(locale),
        y: (y + 1).toLocaleString(locale),
      })}
      className={classNames(styles.tile, className, {
        [styles.first3]: x < 3,
        [styles.last3]: config.boardWidth - x - 1 < 3,
        [styles.sharpTopLeft]: cellTop?.hasTile() || cellLeft?.hasTile(),
        [styles.sharpTopRight]: cellTop?.hasTile() || cellRight?.hasTile(),
        [styles.sharpBottomLeft]: cellBottom?.hasTile() || cellLeft?.hasTile(),
        [styles.sharpBottomRight]: cellBottom?.hasTile() || cellRight?.hasTile(),
      })}
      character={isEmpty ? undefined : tile.character}
      highlighted={cell.isCandidate()}
      inputRef={inputRef}
      isBlank={tile.isBlank}
      isValid={isValid}
      points={points}
      raised={!isEmpty}
      size={size}
      tabIndex={cell.x === 0 && cell.y === 0 ? undefined : -1}
      onChange={onChange}
      onFocus={handleFocus}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    />
  );
};

export default Cell;
