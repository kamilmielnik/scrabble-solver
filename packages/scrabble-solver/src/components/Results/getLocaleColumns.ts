import { ResultColumn } from 'types';

import styles from './Results.module.scss';
import { Column } from './types';

const getLocaleColumns = (options: {
  consonants: boolean;
  vowels: boolean;
  tiles: boolean;
  blanks: boolean;
  words: boolean;
  coordinates: boolean;
}): Column[] => {
  const { consonants, vowels, tiles, blanks, words, coordinates } = options;
  const columns: Column[] = [
    {
      className: '',
      id: ResultColumn.Word,
      translationKey: 'common.word',
    },
  ];
  if (coordinates) {
    columns.push({
      className: '',
      id: ResultColumn.Coordinates,
      translationKey: 'common.coordinates',
    });
  }
  if (tiles) {
    columns.push({
      className: styles.stat,
      id: ResultColumn.TilesCount,
      translationKey: 'common.tiles',
    });
  }
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
  if (blanks) {
    columns.push({
      className: styles.stat,
      id: ResultColumn.BlanksCount,
      translationKey: 'common.blanks',
    });
  }
  if (words) {
    columns.push({
      className: styles.stat,
      id: ResultColumn.WordsCount,
      translationKey: 'common.words',
    });
  }
  columns.push({
    className: styles.points,
    id: ResultColumn.Points,
    translationKey: 'common.points',
  });

  return columns;
};

export default getLocaleColumns;
