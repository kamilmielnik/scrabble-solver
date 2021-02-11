import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { useTranslate } from 'state';
import { TranslationKey } from 'types';

import styles from './Results.module.scss';

interface Column {
  className: string;
  labelKey: TranslationKey;
  titleKey: TranslationKey;
}

const columns: Column[] = [
  {
    className: styles.word,
    labelKey: 'results.header.word',
    titleKey: 'results.header.word',
  },
  {
    className: styles.stat,
    labelKey: 'results.header.tiles.short',
    titleKey: 'results.header.tiles',
  },
  {
    className: styles.stat,
    labelKey: 'results.header.blanks.short',
    titleKey: 'results.header.blanks',
  },
  {
    className: styles.stat,
    labelKey: 'results.header.words.short',
    titleKey: 'results.header.words',
  },
  {
    className: styles.points,
    labelKey: 'results.header.points',
    titleKey: 'results.header.points',
  },
];

const Header = (): ReactElement => {
  const translate = useTranslate();

  return (
    <div className={styles.header}>
      {columns.map((column, index) => (
        <div className={classNames(styles.cell, column.className)} key={index} title={translate(column.titleKey)}>
          {translate(column.labelKey)}
        </div>
      ))}
    </div>
  );
};

export default Header;
