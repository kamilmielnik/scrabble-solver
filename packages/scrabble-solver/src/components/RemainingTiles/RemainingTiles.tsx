import { BLANK } from '@scrabble-solver/constants';
import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import { REMAINING_TILES_TILE_SIZE } from 'parameters';
import { selectRemainingTiles, useTranslate, useTypedSelector } from 'state';

import Sidebar from '../Sidebar';
import Tile from '../Tile';

import styles from './RemainingTiles.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const RemainingTiles: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const translate = useTranslate();
  const remainingTiles = useTypedSelector(selectRemainingTiles);

  return (
    <Sidebar className={className} isOpen={isOpen} title={translate('remaining-tiles')} onClose={onClose}>
      <div className={styles.content}>
        {remainingTiles.map(({ character, count, usedCount }) => {
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
        })}
      </div>
    </Sidebar>
  );
};

export default RemainingTiles;
