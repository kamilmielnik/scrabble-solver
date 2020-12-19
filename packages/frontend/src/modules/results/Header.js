import React from 'react';

import { useMessage } from 'modules/i18n';

import styles from './Results.module.scss';

const Header = () => {
  const word = useMessage({ id: 'modules.results.list.word' });
  const points = useMessage({ id: 'modules.results.list.points' });

  return (
    <div className={styles.header}>
      <div className={styles.cell}>{word}</div>
      <div className={styles.cell}>{points}</div>
    </div>
  );
};

export default Header;
