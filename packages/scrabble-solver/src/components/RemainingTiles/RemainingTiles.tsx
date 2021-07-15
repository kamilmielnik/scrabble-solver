import React, { FunctionComponent } from 'react';

import { selectRemainingTilesGroups, useTranslate, useTypedSelector } from 'state';

import Sidebar from '../Sidebar';

import Character from './Character';
import styles from './RemainingTiles.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const RemainingTiles: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const translate = useTranslate();
  const groups = useTypedSelector(selectRemainingTilesGroups);

  return (
    <Sidebar className={className} isOpen={isOpen} title={translate('remaining-tiles')} onClose={onClose}>
      {groups.map(({ remainingCount, tiles, translationKey, totalCount }) => (
        <div className={styles.group} key={translationKey}>
          <h2 className={styles.title}>{`${translate(translationKey)} (${remainingCount} / ${totalCount})`}</h2>

          <div className={styles.content}>
            {tiles.map((tile) => {
              return <Character key={tile.character} tile={tile} />;
            })}
          </div>
        </div>
      ))}
    </Sidebar>
  );
};

export default RemainingTiles;
