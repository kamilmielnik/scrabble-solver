import React from 'react';

import { useTranslation } from 'state';

import styles from './Results.module.scss';

const Header = () => {
  const word = useTranslation('modules.results.list.word');
  const points = useTranslation('modules.results.list.points');

  return (
    <div className={styles.header}>
      <div className={styles.cell}>{word}</div>
      <div className={styles.cell}>{points}</div>
    </div>
  );
};

export default Header;
