import { ResultColumn } from 'types';

import styles from './Results.module.scss';
import { Column } from './types';

const WORD: Column = {
  className: styles.word,
  id: ResultColumn.Word,
  translationKey: 'common.word',
};

const TILES_COUNT: Column = {
  className: styles.stat,
  id: ResultColumn.TilesCount,
  translationKey: 'common.tiles',
};

const CONSONANTS_COUNT: Column = {
  className: styles.stat,
  id: ResultColumn.ConsonantsCount,
  translationKey: 'common.consonants',
};

const VOWELS_COUNT: Column = {
  className: styles.stat,
  id: ResultColumn.VowelsCount,
  translationKey: 'common.vowels',
};

const BLANKS_COUNT: Column = {
  className: styles.stat,
  id: ResultColumn.BlanksCount,
  translationKey: 'common.blanks',
};

const WORDS_COUNT: Column = {
  className: styles.stat,
  id: ResultColumn.WordsCount,
  translationKey: 'common.words',
};

const POINTS: Column = {
  className: styles.points,
  id: ResultColumn.Points,
  translationKey: 'common.points',
};

const getLocaleColumns = (options: { consonants: boolean; vowels: boolean }): Column[] => {
  const { consonants, vowels } = options;
  const columns: Column[] = [WORD, TILES_COUNT];

  if (consonants) {
    columns.push(CONSONANTS_COUNT);
  }

  if (vowels) {
    columns.push(VOWELS_COUNT);
  }

  columns.push(BLANKS_COUNT, WORDS_COUNT, POINTS);

  return columns;
};

export default getLocaleColumns;
