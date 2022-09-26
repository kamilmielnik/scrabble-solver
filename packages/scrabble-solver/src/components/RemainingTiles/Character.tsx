import { BLANK } from '@scrabble-solver/constants';
import classNames from 'classnames';
import { FunctionComponent } from 'react';

import { REMAINING_TILES_TILE_SIZE } from 'parameters';
import { selectCharacterPoints, useTypedSelector } from 'state';
import { RemainingTile } from 'types';

import Tile from '../Tile';

import styles from './Character.module.scss';

interface Props {
  tile: RemainingTile;
}

const Character: FunctionComponent<Props> = ({ tile }) => {
  const { character, count, usedCount } = tile;
  const remainingCount = count - usedCount;
  const points = useTypedSelector((state) => selectCharacterPoints(state, character));

  return (
    <div
      className={classNames(styles.character, {
        [styles.finished]: remainingCount <= 0,
        [styles.overused]: remainingCount < 0,
      })}
      key={character}
    >
      <Tile
        character={character}
        className={styles.tile}
        disabled
        isBlank={character === BLANK}
        points={points}
        raised
        size={REMAINING_TILES_TILE_SIZE}
      />
      <div className={styles.count}>
        {remainingCount} / {count}
      </div>
    </div>
  );
};

export default Character;
