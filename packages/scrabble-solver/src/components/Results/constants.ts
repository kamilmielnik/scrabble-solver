import { ResultColumn } from 'types';

import styles from './Results.module.scss';
import { Column } from './types';

export const COLUMNS: Column[] = [
  {
    className: styles.word,
    id: ResultColumn.Word,
    translationKey: 'common.word',
  },
  {
    className: styles.stat,
    id: ResultColumn.TilesCount,
    translationKey: 'common.tiles',
  },
  {
    className: styles.stat,
    id: ResultColumn.ConsonantsCount,
    translationKey: 'common.consonants',
  },
  {
    className: styles.stat,
    id: ResultColumn.VowelsCount,
    translationKey: 'common.vowels',
  },
  {
    className: styles.stat,
    id: ResultColumn.BlanksCount,
    translationKey: 'common.blanks',
  },
  {
    className: styles.stat,
    id: ResultColumn.WordsCount,
    translationKey: 'common.words',
  },
  {
    className: styles.points,
    id: ResultColumn.Points,
    translationKey: 'common.points',
  },
];
