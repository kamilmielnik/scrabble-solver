import { ResultColumn } from 'types';

import styles from './Results.module.scss';
import { Column } from './types';

const getColumns = (options: { consonants: boolean; vowels: boolean }): Column[] => {
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
      translationKey: 'common.tiles',
    },
  ];

  if (consonants) {
    columns.push({
      className: styles.stat,
      id: ResultColumn.ConsonantsCount,
      translationKey: 'common.consonants',
    });
  }

  if (vowels) {
    columns.push({
      className: styles.stat,
      id: ResultColumn.VowelsCount,
      translationKey: 'common.vowels',
    });
  }

  columns.push(
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
  );

  return columns;
};

export default getColumns;
