import classNames from 'classnames';
import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';

import { sortDown, sortUp } from 'icons';
import {
  resultsSlice,
  selectResultsSortColumn,
  selectResultsSortDirection,
  useTranslate,
  useTypedSelector,
} from 'state';
import { ResultColumn, SortDirection, TranslationKey } from 'types';

import SvgIcon from '../SvgIcon';

import styles from './Results.module.scss';

interface Column {
  className: string;
  id: ResultColumn;
  labelKey: TranslationKey;
  titleKey: TranslationKey;
}

const columns: Column[] = [
  {
    className: styles.word,
    id: ResultColumn.Word,
    labelKey: 'common.word',
    titleKey: 'common.word',
  },
  {
    className: styles.stat,
    id: ResultColumn.TilesCount,
    labelKey: 'common.tiles',
    titleKey: 'common.tiles',
  },
  {
    className: styles.stat,
    id: ResultColumn.ConsonantsCount,
    labelKey: 'common.consonants',
    titleKey: 'common.consonants',
  },
  {
    className: styles.stat,
    id: ResultColumn.VowelsCount,
    labelKey: 'common.vowels',
    titleKey: 'common.vowels',
  },
  {
    className: styles.stat,
    id: ResultColumn.BlanksCount,
    labelKey: 'common.blanks',
    titleKey: 'common.blanks',
  },
  {
    className: styles.stat,
    id: ResultColumn.WordsCount,
    labelKey: 'common.words',
    titleKey: 'common.words',
  },
  {
    className: styles.points,
    id: ResultColumn.Points,
    labelKey: 'common.points',
    titleKey: 'common.points',
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
          title={translate(column.titleKey)}
          type="button"
          onClick={() => handleOrderChange(column.id)}
        >
          <span className={styles.cell}>
            <span className={styles.headerButtonLabel}>{translate(column.labelKey)}</span>

            {sortColumn === column.id && (
              <SvgIcon
                className={styles.sortIcon}
                icon={sortDirection === SortDirection.Ascending ? sortUp : sortDown}
              />
            )}
          </span>
        </button>
      ))}
    </div>
  );
};

export default Header;
