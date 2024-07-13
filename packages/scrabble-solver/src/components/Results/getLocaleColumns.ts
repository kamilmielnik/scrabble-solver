import { OneTwoThree, Square, SquareA, SquareB, Squares, Words } from 'icons';
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
      width: 55,
    },
  ];

  if (vowels) {
    columns.push({
      className: styles.stat,
      Icon: SquareA,
      id: ResultColumn.VowelsCount,
      translationKey: 'common.vowels',
      width: 55,
    });
  }

  if (consonants) {
    columns.push({
      className: styles.stat,
      Icon: SquareB,
      id: ResultColumn.ConsonantsCount,
      translationKey: 'common.consonants',
      width: 55,
    });
  }

  columns.push(
    {
      className: styles.stat,
      Icon: Square,
      id: ResultColumn.BlanksCount,
      translationKey: 'common.blanks',
      width: 55,
    },
    {
      className: styles.stat,
      Icon: Words,
      id: ResultColumn.WordsCount,
      translationKey: 'common.words',
      width: 55,
    },
    {
      className: styles.points,
      Icon: OneTwoThree,
      id: ResultColumn.Points,
      translationKey: 'common.points',
      width: 80,
    },
  );

  return columns;
};

export default getLocaleColumns;
