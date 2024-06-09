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
      sortable: true,
    },
    {
      className: styles.stat,
      id: ResultColumn.TilesCount,
      translationKey: 'common.tiles',
      sortable: true,
    },
  ];

  if (consonants) {
    columns.push({
      className: styles.stat,
      id: ResultColumn.ConsonantsCount,
      translationKey: 'common.consonants',
      sortable: true,
    });
  }

  if (vowels) {
    columns.push({
      className: styles.stat,
      id: ResultColumn.VowelsCount,
      translationKey: 'common.vowels',
      sortable: true,
    });
  }

  columns.push(
    {
      className: styles.stat,
      id: ResultColumn.BlanksCount,
      translationKey: 'common.blanks',
      sortable: true,
    },
    {
      className: styles.stat,
      id: ResultColumn.WordsCount,
      translationKey: 'common.words',
      sortable: true,
    },
    {
      className: styles.points,
      id: ResultColumn.Points,
      translationKey: 'common.points',
      sortable: true,
    },
  );

  return columns;
};

export default getLocaleColumns;
