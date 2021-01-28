import React, { FunctionComponent } from 'react';
import { useKey } from 'react-use';

import { selectConfig, useTranslate, useTypedSelector } from 'state';

import styles from './RemainingTiles.module.scss';
import Sidebar from '../Sidebar';
import Tile from '../Tile';

interface Props {
  className?: string;
  hidden: boolean;
  onClose: () => void;
}

const TILE_SIZE = 50;

const RemainingTiles: FunctionComponent<Props> = ({ className, hidden, onClose }) => {
  const translate = useTranslate();
  const config = useTypedSelector(selectConfig);

  const handleClose = () => {
    if (!hidden) {
      onClose();
    }
  };

  useKey('Escape', handleClose, { event: 'keydown' }, [handleClose]);

  return (
    <Sidebar className={className} hidden={hidden} title={translate('remaining-tiles')} onClose={handleClose}>
      <div className={styles.content}>
        {config.tiles.map(({ character, count }) => {
          const remainingCount = 0;

          return (
            <div className={styles.tile} key={character}>
              <Tile character={character} disabled raised size={TILE_SIZE} />
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
