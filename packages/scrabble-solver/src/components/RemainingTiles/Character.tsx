import { BLANK } from '@scrabble-solver/constants';
import classNames from 'classnames';
import { FunctionComponent } from 'react';

import { LOCALE_FEATURES } from 'i18n';
import { REMAINING_TILES_TILE_SIZE } from 'parameters';
import { selectCharacterPoints, selectLocale, useTypedSelector } from 'state';
import { RemainingTile } from 'types';

import Progress from '../Progress';
import Tile from '../Tile';

import styles from './Character.module.scss';

interface Props {
  tile: RemainingTile;
}

const Character: FunctionComponent<Props> = ({ tile }) => {
  const locale = useTypedSelector(selectLocale);
  const { direction } = LOCALE_FEATURES[locale];
  const { character, count, usedCount } = tile;
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

export default Character;
