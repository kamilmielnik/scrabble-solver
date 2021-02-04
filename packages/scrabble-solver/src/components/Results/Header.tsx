import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { useTranslate } from 'state';

import styles from './Results.module.scss';

const Header = (): ReactElement => {
  const translate = useTranslate();

  return (
    <div className={styles.header}>
      <div className={classNames(styles.cell, styles.word)}>{translate('results.header.word')}</div>
      <div className={classNames(styles.cell, styles.stat)}>#C</div>
      <div className={classNames(styles.cell, styles.stat)}>#T</div>
      <div className={classNames(styles.cell, styles.stat)}>#B</div>
      <div className={classNames(styles.cell, styles.points)}>{translate('results.header.points')}</div>
    </div>
  );
};

export default Header;
