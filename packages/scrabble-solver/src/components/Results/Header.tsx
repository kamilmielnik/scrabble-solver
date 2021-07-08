import classNames from 'classnames';
import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';

import { SortDown, SortUp } from 'icons';
import {
  resultsSlice,
  selectResultsSortColumn,
  selectResultsSortDirection,
  useTranslate,
  useTypedSelector,
} from 'state';
import { ResultColumn, SortDirection, TranslationKey } from 'types';

import styles from './Results.module.scss';

interface Column {
  className: string;
  id: ResultColumn;
  translationKey: TranslationKey;
}

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

const Header = (): ReactElement => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const sortColumn = useTypedSelector(selectResultsSortColumn);
  const sortDirection = useTypedSelector(selectResultsSortDirection);

  const handleOrderChange = (columnId: ResultColumn) => {
    dispatch(resultsSlice.actions.sort(columnId));
  };

  return (
    <div className={styles.header}>
      {columns.map((column) => (
        <button
          className={classNames(styles.headerButton, column.className)}
          key={column.id}
          title={translate(column.translationKey)}
          type="button"
          onClick={() => handleOrderChange(column.id)}
        >
          <span className={styles.cell}>
            <span className={styles.headerButtonLabel}>{translate(column.translationKey)}</span>

            {sortColumn === column.id && sortDirection === SortDirection.Ascending && (
              <SortUp className={styles.sortIcon} />
            )}

            {sortColumn === column.id && sortDirection === SortDirection.Descending && (
              <SortDown className={styles.sortIcon} />
            )}
          </span>
        </button>
      ))}
    </div>
  );
};

export default Header;
