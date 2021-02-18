import { BLANK } from '@scrabble-solver/constants';
import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import { REMAINING_TILES_TILE_SIZE } from 'parameters';
import Tile from '../Tile';

import styles from './Character.module.scss';

interface Props {
  character: string;
  count: number;
  usedCount: number;
}

const Character: FunctionComponent<Props> = ({ character, count, usedCount }) => {
  const remainingCount = count - usedCount;

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
