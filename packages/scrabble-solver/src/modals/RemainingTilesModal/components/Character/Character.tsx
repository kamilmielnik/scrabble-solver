import { BLANK } from '@scrabble-solver/constants';
import classNames from 'classnames';
import { type FunctionComponent, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Progress } from '@/components/Progress';
import { Tile } from '@/components/Tile';
import { LOCALE_FEATURES } from '@/i18n/constants';
import {
  hoveredTileSlice,
  selectCharacterPoints,
  selectHoveredCharacter,
  selectLocale,
  useTypedSelector,
} from '@/state';
import { type RemainingTile } from '@/types';

import styles from './Character.module.scss';

interface Props {
  canHighlight: boolean;
  tile: RemainingTile;
}

export const Character: FunctionComponent<Props> = ({ canHighlight, tile }) => {
  const dispatch = useDispatch();
  const locale = useTypedSelector(selectLocale);
  const hoveredCharacter = useTypedSelector(selectHoveredCharacter);
  const { direction } = LOCALE_FEATURES[locale];
  const { character, count, usedCount } = tile;

  if (typeof count === 'undefined') {
    throw new Error('Remaining tiles not supported for this config');
  }

  const remainingCount = count - usedCount;
  const points = useTypedSelector((state) => selectCharacterPoints(state, character));
  const current = direction === 'ltr' ? remainingCount : count;
  const total = direction === 'ltr' ? count : remainingCount;
  const isUsed = usedCount > 0;
  const isHighlightable = canHighlight && isUsed;
  const isHighlighted = isHighlightable && hoveredCharacter === character;

  const handleMouseEnter = useCallback(() => {
    dispatch(hoveredTileSlice.actions.set(character));
  }, [character, dispatch]);

  const handleMouseLeave = useCallback(() => {
    dispatch(hoveredTileSlice.actions.clear());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(hoveredTileSlice.actions.clear());
    };
  }, [dispatch]);

  return (
    <div
      className={classNames(styles.character, {
        [styles.finished]: remainingCount <= 0,
        [styles.overused]: remainingCount < 0,
        [styles.unused]: !isUsed,
      })}
      data-testid={character === BLANK ? 'remaining-tile-blank' : `remaining-tile-${character}`}
      onMouseEnter={isHighlightable ? handleMouseEnter : undefined}
      onMouseLeave={isHighlightable ? handleMouseLeave : undefined}
    >
      <Tile
        aria-label={character}
        character={character}
        className={styles.tile}
        disabled
        highlighted={isHighlighted}
        isBlank={character === BLANK}
        isValid={remainingCount >= 0}
        locale={locale}
        points={points}
        raised
      />

      <Progress className={styles.remaining} max={count} value={remainingCount} />

      <div className={styles.count}>
        {current.toLocaleString(locale)} / {total.toLocaleString(locale)}
      </div>
    </div>
  );
};
