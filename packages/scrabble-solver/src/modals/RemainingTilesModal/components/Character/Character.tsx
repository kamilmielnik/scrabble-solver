import { BLANK } from '@scrabble-solver/constants';
import classNames from 'classnames';
import { type FunctionComponent, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Progress, Tile } from '@/components';
import { LOCALE_FEATURES } from '@/i18n';
import { REMAINING_TILES_TILE_SIZE } from '@/parameters';
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
  tile: RemainingTile;
}

export const Character: FunctionComponent<Props> = ({ tile }) => {
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
  const isHovered = isUsed && hoveredCharacter === character;

  const handleMouseEnter = useCallback(() => {
    if (!isUsed) {
      return;
    }
    dispatch(hoveredTileSlice.actions.set(character));
  }, [character, dispatch, isUsed]);

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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Tile
        aria-label={character}
        character={character}
        className={styles.tile}
        disabled
        highlighted={isHovered}
        isBlank={character === BLANK}
        isValid={remainingCount >= 0}
        points={points}
        raised
        size={REMAINING_TILES_TILE_SIZE}
      />

      <Progress
        className={styles.remaining}
        max={count}
        style={{
          width: REMAINING_TILES_TILE_SIZE,
        }}
        value={remainingCount}
      />

      <div className={styles.count}>
        {current.toLocaleString(locale)} / {total.toLocaleString(locale)}
      </div>
    </div>
  );
};
