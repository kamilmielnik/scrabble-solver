import React, { ReactElement } from 'react';

import { useTranslate } from 'state';

import styles from './Results.module.scss';

const Header = (): ReactElement => {
  const translate = useTranslate();

  return (
    <div className={styles.header}>
      <div className={styles.cell}>{translate('results.header.word')}</div>
      <div className={styles.cell}>{translate('results.header.points')}</div>
    </div>
  );
};

export default Header;
