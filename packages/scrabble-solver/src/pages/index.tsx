import React from 'react';

import styles from './index.module.scss';

const Index = () => {
  return (
    <div className={styles.index}>
      <div className={styles.nav}>nav</div>

      <div className={styles.content}>
        <div className={styles.boardContainer}>board</div>
        <div className={styles.sidebar}>sidebar</div>
      </div>

      <div className={styles.tilesContainer}>tiles</div>
    </div>
  );
};

export default Index;
