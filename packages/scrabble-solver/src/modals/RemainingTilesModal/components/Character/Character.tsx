import { BLANK } from '@scrabble-solver/constants';
import classNames from 'classnames';
import { type FunctionComponent } from 'react';

import { Progress, Tile } from 'components';
import { LOCALE_FEATURES } from 'i18n';
import { REMAINING_TILES_TILE_SIZE } from 'parameters';
import { selectCharacterPoints, selectLocale, useTypedSelector } from 'state';
import { type RemainingTile } from 'types';

import styles from './Character.module.scss';

interface Props {
  tile: RemainingTile;
}

export const Character: FunctionComponent<Props> = ({ tile }) => {
  const locale = useTypedSelector(selectLocale);
  const { direction } = LOCALE_FEATURES[locale];
  const { character, count, usedCount } = tile;

  if (typeof count === 'undefined') {
    throw new Error('Remaining tiles not supported for this config');
  }

  const remainingCount = count - usedCount;
  const points = useTypedSelector((state) => selectCharacterPoints(state, character));
  const current = direction === 'ltr' ? remainingCount : count;
  const total = direction === 'ltr' ? count : remainingCount;

  return (
    <div
      className={classNames(styles.character, {
        [styles.finished]: remainingCount <= 0,
        [styles.overused]: remainingCount < 0,
      })}
    >
      <Tile
        aria-label={character}
        character={character}
        className={styles.tile}
        disabled
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
