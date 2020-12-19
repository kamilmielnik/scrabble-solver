import React from 'react';

import { flagGb, flagPl, flagUs } from 'icons';
import { SvgIcon, Well } from 'components';

import styles from './index.module.scss';

const Index = () => {
  return (
    <div className={styles.index}>
      <div className={styles.nav}>
        <h1 className={styles.title}>Scrabble Solver</h1>
        <div className={styles.flags}>
          <SvgIcon className={styles.flag} icon={flagPl} />
          <SvgIcon className={styles.flag} icon={flagGb} />
          <SvgIcon className={styles.flag} icon={flagUs} />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.boardContainer}>
          <div className={styles.board}>board</div>
        </div>
        <div className={styles.sidebarContainer}>
          <Well className={styles.sidebar}>sidebar</Well>
        </div>
      </div>

      <div className={styles.tilesContainer}>tiles</div>
    </div>
  );
};

export default Index;
