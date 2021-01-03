import React from 'react';

import { useTranslation } from 'state';

import styles from './Results.module.scss';

const Header = () => {
  const wordTranslation = useTranslation('results.header.word');
  const pointsTranslation = useTranslation('results.header.points');

  return (
    <div className={styles.header}>
      <div className={styles.cell}>{wordTranslation}</div>
      <div className={styles.cell}>{pointsTranslation}</div>
    </div>
  );
};

export default Header;
