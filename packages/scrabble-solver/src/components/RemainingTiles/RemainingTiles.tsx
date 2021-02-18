import { BLANK, CONSONANTS, VOWELS } from '@scrabble-solver/constants';
import React, { FunctionComponent } from 'react';

import {
  selectRemainingTiles,
  selectRemainingTilesCount,
  selectTotalTilesCount,
  useTranslate,
  useTypedSelector,
} from 'state';

import Sidebar from '../Sidebar';

import Character from './Character';
import styles from './RemainingTiles.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const getRemainingCount = (remainingTiles: { count: number; usedCount: number }[]): number => {
  return remainingTiles.reduce((sum, { count, usedCount }) => sum + count - usedCount, 0);
};

const getTotalCount = (remainingTiles: { count: number }[]): number => {
  return remainingTiles.reduce((sum, { count }) => sum + count, 0);
};

const RemainingTiles: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const translate = useTranslate();
  const remainingTiles = useTypedSelector(selectRemainingTiles);
  const totalCount = useTypedSelector(selectTotalTilesCount);
  const totalRemainingCount = useTypedSelector(selectRemainingTilesCount);
  const consonants = remainingTiles.filter(({ character }) => CONSONANTS.includes(character));
  const vowels = remainingTiles.filter(({ character }) => VOWELS.includes(character));
  const blanks = remainingTiles.filter(({ character }) => character === BLANK);

  const groups = [
    {
      tiles: vowels,
      title: translate('results.header.vowels'),
    },
    {
      tiles: consonants,
      title: translate('results.header.consonants'),
    },
    {
      tiles: blanks,
      title: translate('results.header.blanks'),
    },
  ];

  return (
    <Sidebar
      className={className}
      isOpen={isOpen}
      title={`${translate('remaining-tiles')} (${totalRemainingCount})`}
      onClose={onClose}
    >
      <div title={`${translate('remaining-tiles')} (${totalRemainingCount} / ${totalCount})`}>
        {groups.map(({ tiles, title }) => (
          <div className={styles.group} key={title}>
            <h2 className={styles.title}>
              {title} ({getRemainingCount(tiles)} / {getTotalCount(tiles)})
            </h2>

            <div className={styles.content}>
              {tiles.map(({ character, count, usedCount }) => {
                return <Character character={character} count={count} key={character} usedCount={usedCount} />;
              })}
            </div>
          </div>
        ))}
      </div>
    </Sidebar>
  );
};

export default RemainingTiles;
