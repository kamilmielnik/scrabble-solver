import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { sortDown, sortUp } from 'icons';
import { useTranslate } from 'state';
import { TranslationKey } from 'types';

import SvgIcon from '../SvgIcon';

import styles from './Results.module.scss';

interface Column {
  className: string;
  id: string;
  labelKey: TranslationKey;
  titleKey: TranslationKey;
}

const columns: Column[] = [
  {
    className: styles.word,
    id: 'word',
    labelKey: 'results.header.word',
    titleKey: 'results.header.word',
  },
  {
    className: styles.stat,
    id: 'tiles-count',
    labelKey: 'results.header.tiles.short',
    titleKey: 'results.header.tiles',
  },
  {
    className: styles.stat,
    id: 'blanks-count',
    labelKey: 'results.header.blanks.short',
    titleKey: 'results.header.blanks',
  },
  {
    className: styles.stat,
    id: 'words-count',
    labelKey: 'results.header.words.short',
    titleKey: 'results.header.words',
  },
  {
    className: styles.points,
    id: 'points',
    labelKey: 'results.header.points',
    titleKey: 'results.header.points',
  },
];

const Header = (): ReactElement => {
  const translate = useTranslate();
  const sortId = 'word';
  const sortOrder = 'ascending';

  return (
    <div className={styles.header}>
      {columns.map((column) => (
        <div className={classNames(styles.cell, column.className)} key={column.id} title={translate(column.titleKey)}>
          {translate(column.labelKey)}

          {sortId === column.id && (
            <SvgIcon className={styles.sortIcon} icon={sortOrder === 'ascending' ? sortUp : sortDown} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Header;
