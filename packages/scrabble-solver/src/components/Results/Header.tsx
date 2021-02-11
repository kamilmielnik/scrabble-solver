import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { sortDown, sortUp } from 'icons';
import { useTranslate } from 'state';
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
    labelKey: 'results.header.word',
    titleKey: 'results.header.word',
  },
  {
    className: styles.stat,
    id: ResultColumn.TilesCount,
    labelKey: 'results.header.tiles.short',
    titleKey: 'results.header.tiles',
  },
  {
    className: styles.stat,
    id: ResultColumn.BlanksCount,
    labelKey: 'results.header.blanks.short',
    titleKey: 'results.header.blanks',
  },
  {
    className: styles.stat,
    id: ResultColumn.WordsCount,
    labelKey: 'results.header.words.short',
    titleKey: 'results.header.words',
  },
  {
    className: styles.points,
    id: ResultColumn.Points,
    labelKey: 'results.header.points',
    titleKey: 'results.header.points',
  },
];

const Header = (): ReactElement => {
  const translate = useTranslate();

  const sortColumn = ResultColumn.Word;
  const sortDirection = SortDirection.Ascending;

  const handleOrderChange = (columnId: ResultColumn) => {};

  return (
    <div className={styles.header}>
      {columns.map((column) => (
        <button
          className={styles.headerButton}
          key={column.id}
          title={translate(column.titleKey)}
          type="button"
          onClick={() => handleOrderChange(column.id)}
        >
          <div className={classNames(styles.cell, column.className)}>
            {translate(column.labelKey)}

            {sortColumn === column.id && (
              <SvgIcon
                className={styles.sortIcon}
                icon={sortDirection === SortDirection.Ascending ? sortUp : sortDown}
              />
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default Header;
