import { AlphabetUppercase, OneTwoThree, Square, SquareA, SquareB, Squares } from 'icons';
import { ResultColumn } from 'types';

import styles from './Results.module.scss';
import { Column } from './types';

const getLocaleColumns = (options: { consonants: boolean; vowels: boolean }): Column[] => {
  const { consonants, vowels } = options;
  const columns: Column[] = [
    {
      className: styles.word,
      id: ResultColumn.Word,
      translationKey: 'common.word',
    },
    {
      className: styles.stat,
      id: ResultColumn.TilesCount,
      Icon: Squares,
      translationKey: 'common.tiles',
    },
  ];

  if (vowels) {
    columns.push({
      className: styles.stat,
      Icon: SquareA,
      id: ResultColumn.VowelsCount,
      translationKey: 'common.vowels',
    });
  }

  if (consonants) {
    columns.push({
      className: styles.stat,
      Icon: SquareB,
      id: ResultColumn.ConsonantsCount,
      translationKey: 'common.consonants',
    });
  }

  columns.push(
    {
      className: styles.stat,
      Icon: Square,
      id: ResultColumn.BlanksCount,
      translationKey: 'common.blanks',
    },
    {
      className: styles.stat,
      Icon: AlphabetUppercase,
      id: ResultColumn.WordsCount,
      translationKey: 'common.words',
    },
    {
      className: styles.points,
      Icon: OneTwoThree,
      id: ResultColumn.Points,
      translationKey: 'common.points',
    },
  );

  return columns;
};

export default getLocaleColumns;
