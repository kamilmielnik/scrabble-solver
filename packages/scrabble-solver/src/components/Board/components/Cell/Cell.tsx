import { EMPTY_CELL } from '@scrabble-solver/constants';
import { type Cell as CellModel, type Config, type Locale, type ShowCoordinates } from '@scrabble-solver/types';
import classNames from 'classnames';
import {
  type ChangeEventHandler,
  type FocusEventHandler,
  type FunctionComponent,
  memo,
  type MouseEventHandler,
  type RefObject,
  type TouchEventHandler,
  useCallback,
} from 'react';

import { getCoordinate } from '@/lib/getCoordinate';
import { selectInputMode, useTypedStore } from '@/state';
import type { Translate } from '@/types';

import { Tile } from '../../../Tile';

import styles from './Cell.module.scss';

interface Props {
  cell: CellModel;
  cellBottom?: CellModel;
  cellLeft?: CellModel;
  cellRight?: CellModel;
  cellTop?: CellModel;
  className?: string;
  config: Config;
  inputRef: RefObject<HTMLInputElement | null>;
  isHoverMatch: boolean;
  isHoveredWordPart?: boolean;
  isReachable?: boolean;
  locale: Locale;
  showCoordinates: ShowCoordinates;
  translate: Translate;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onFocus: (x: number, y: number) => void;
}

/**
 * Must not subscribe to the store - it can read the story only in event handlers.
 */
const CellBase: FunctionComponent<Props> = ({
  cell,
  cellBottom,
  cellLeft,
  cellRight,
  cellTop,
  className,
  config,
  inputRef,
  isHoverMatch,
  isHoveredWordPart = false,
  isReachable = true,
  locale,
  showCoordinates,
  translate,
  onChange,
  onFocus,
}) => {
  const { tile, x, y } = cell;
  const store = useTypedStore();
  const isEmpty = tile.character === EMPTY_CELL;
  const points = config.getTilePoints(tile);
  const isValid = !cell.hasTile() || config.tiles.some(({ character }) => character === tile.character);

  const handleFocus: FocusEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (selectInputMode(store.getState()) === 'touchscreen') {
        event.preventDefault();
        event.target.blur();
      }

      onFocus(x, y);
    },
    [store, onFocus, x, y],
  );

  const handleMouseDown: MouseEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (selectInputMode(store.getState()) === 'touchscreen') {
        event.preventDefault();
      }

      onFocus(x, y);
    },
    [store, onFocus, x, y],
  );

  const handleTouchStart: TouchEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (selectInputMode(store.getState()) === 'touchscreen') {
        event.preventDefault();
      }

      onFocus(x, y);
    },
    [store, onFocus, x, y],
  );

  return (
    <Tile
      aria-label={translate('cell.tile.location', {
        coordinates:
          showCoordinates === 'alternative'
            ? `${getCoordinate(x, 'number')}${getCoordinate(y, 'letter')}`
            : `${getCoordinate(x, 'letter')}${getCoordinate(y, 'number')}`,
      })}
      className={classNames(styles.tile, className, {
        [styles.first3]: x < 3,
        [styles.last3]: config.boardWidth - x - 1 < 3,
        [styles.sharpTopLeft]: cellTop?.hasTile() || cellLeft?.hasTile(),
        [styles.sharpTopRight]: cellTop?.hasTile() || cellRight?.hasTile(),
        [styles.sharpBottomLeft]: cellBottom?.hasTile() || cellLeft?.hasTile(),
        [styles.sharpBottomRight]: cellBottom?.hasTile() || cellRight?.hasTile(),
        [styles.unreachable]: !isReachable,
      })}
      character={isEmpty ? undefined : tile.character}
      highlighted={cell.isCandidate() || isHoverMatch || isHoveredWordPart}
      inputRef={inputRef}
      isBlank={tile.isBlank}
      isValid={isValid}
      locale={locale}
      points={points}
      raised={!isEmpty}
      tabIndex={cell.x === 0 && cell.y === 0 ? undefined : -1}
      onChange={onChange}
      onFocus={handleFocus}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    />
  );
};

export const Cell = memo(CellBase);
