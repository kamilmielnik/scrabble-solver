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

  return (
    <Sidebar className={className} isOpen={isOpen} title={translate('remaining-tiles')} onClose={onClose}>
      <div className={styles.summary}>
        <div className={styles.entry} title={`${totalRemainingCount} / ${totalCount}`}>
          <div className={styles.title}>{translate('results.header.tiles')}</div>
          <div className={styles.value}>
            {totalRemainingCount} / {totalCount}
          </div>
        </div>
        <div className={styles.entry} title={`${getRemainingCount(consonants)} / ${getTotalCount(consonants)}`}>
          <div className={styles.title}>{translate('results.header.consonants')}</div>
          <div className={styles.value}>
            {getRemainingCount(consonants)} / {getTotalCount(consonants)}
          </div>
        </div>
        <div className={styles.entry} title={`${getRemainingCount(vowels)} / ${getTotalCount(vowels)}`}>
          <div className={styles.title}>{translate('results.header.vowels')}</div>
          <div className={styles.value}>
            {getRemainingCount(vowels)} / {getTotalCount(vowels)}
          </div>
        </div>
        <div className={styles.entry} title={`${getRemainingCount(blanks)} / ${getTotalCount(blanks)}`}>
          <div className={styles.title}>{translate('results.header.blanks')}</div>
          <div className={styles.value}>
            {getRemainingCount(blanks)} / {getTotalCount(blanks)}
          </div>
        </div>
      </div>

      <div
        className={styles.content}
        title={`${translate('remaining-tiles')} (${totalRemainingCount} / ${totalCount})`}
      >
        {remainingTiles.map(({ character, count, usedCount }) => {
          return <Character character={character} count={count} key={character} usedCount={usedCount} />;
        })}
      </div>
    </Sidebar>
  );
};

export default RemainingTiles;
