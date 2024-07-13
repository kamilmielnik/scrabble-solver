import { OneTwoThree, Square, SquareA, SquareB, Squares, Words } from 'icons';
import { ResultColumn, ResultColumnId } from 'types';

import styles from './Results.module.scss';

const getLocaleColumns = (options: { consonants: boolean; vowels: boolean }): ResultColumn[] => {
  const { consonants, vowels } = options;
  const columns: ResultColumn[] = [
    {
      className: styles.word,
      id: ResultColumnId.Word,
      translationKey: 'common.word',
    },
    {
      className: styles.stat,
      id: ResultColumnId.TilesCount,
      Icon: Squares,
      translationKey: 'common.tiles',
      width: 55,
    },
  ];

  if (vowels) {
    columns.push({
      className: styles.stat,
      Icon: SquareA,
      id: ResultColumnId.VowelsCount,
      translationKey: 'common.vowels',
      width: 55,
    });
  }

  if (consonants) {
    columns.push({
      className: styles.stat,
      Icon: SquareB,
      id: ResultColumnId.ConsonantsCount,
      translationKey: 'common.consonants',
      width: 55,
    });
  }

  columns.push(
    {
      className: styles.stat,
      Icon: Square,
      id: ResultColumnId.BlanksCount,
      translationKey: 'common.blanks',
      width: 55,
    },
    {
      className: styles.stat,
      Icon: Words,
      id: ResultColumnId.WordsCount,
      translationKey: 'common.words',
      width: 55,
    },
    {
      className: styles.points,
      Icon: OneTwoThree,
      id: ResultColumnId.Points,
      translationKey: 'common.points',
      width: 80,
    },
  );

  return columns;
};

export default getLocaleColumns;
