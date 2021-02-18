import { BLANK, CONSONANTS, VOWELS } from '@scrabble-solver/constants';
import React, { FunctionComponent } from 'react';

import { selectRemainingTiles, selectRemainingTilesCount, useTranslate, useTypedSelector } from 'state';
import { RemainingTile, TranslationKey } from 'types';

import Sidebar from '../Sidebar';

import Character from './Character';
import styles from './RemainingTiles.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const getRemainingCount = (remainingTiles: RemainingTile[]): number => {
  return remainingTiles.reduce((sum, { count, usedCount }) => sum + count - usedCount, 0);
};

const getTotalCount = (remainingTiles: RemainingTile[]): number => {
  return remainingTiles.reduce((sum, { count }) => sum + count, 0);
};

interface Group {
  remainingCount: number;
  tiles: RemainingTile[];
  translationKey: TranslationKey;
  totalCount: number;
}

const RemainingTiles: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const translate = useTranslate();
  const remainingTiles = useTypedSelector(selectRemainingTiles);
  const totalRemainingCount = useTypedSelector(selectRemainingTilesCount);
  const consonants = remainingTiles.filter(({ character }) => CONSONANTS.includes(character));
  const vowels = remainingTiles.filter(({ character }) => VOWELS.includes(character));
  const blanks = remainingTiles.filter(({ character }) => character === BLANK);

  const groups: Group[] = [
    {
      remainingCount: getRemainingCount(vowels),
      tiles: vowels,
      translationKey: 'results.header.vowels',
      totalCount: getTotalCount(vowels),
    },
    {
      remainingCount: getRemainingCount(consonants),
      tiles: consonants,
      translationKey: 'results.header.consonants',
      totalCount: getTotalCount(consonants),
    },
    {
      remainingCount: getRemainingCount(blanks),
      tiles: blanks,
      translationKey: 'results.header.blanks',
      totalCount: getTotalCount(blanks),
    },
  ];

  return (
    <Sidebar
      className={className}
      isOpen={isOpen}
      title={`${translate('remaining-tiles')} (${totalRemainingCount})`}
      onClose={onClose}
    >
      {groups.map(({ remainingCount, tiles, translationKey, totalCount }) => (
        <div className={styles.group} key={translationKey}>
          <h2 className={styles.title}>{`${translate(translationKey)} (${remainingCount} / ${totalCount})`}</h2>

          <div className={styles.content}>
            {tiles.map((tile) => {
              return <Character tile={tile} />;
            })}
          </div>
        </div>
      ))}
    </Sidebar>
  );
};

export default RemainingTiles;
