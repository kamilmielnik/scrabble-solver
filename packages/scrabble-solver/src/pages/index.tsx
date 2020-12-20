import classNames from 'classnames';
import React from 'react';

import { flagGb, flagPl, flagUs } from 'icons';
import { SvgIcon, Well } from 'components';

import styles from './index.module.scss';

const Index = () => {
  return (
    <div className={styles.index}>
      <div className={styles.nav}>
        <h1 className={styles.title}>Scrabble Solver by Kamil Mielnik</h1>
        <div className={styles.flags}>
          <SvgIcon className={classNames(styles.flag, styles.pl)} icon={flagPl} />
          <SvgIcon className={classNames(styles.flag, styles.gb)} icon={flagGb} />
          <SvgIcon className={classNames(styles.flag, styles.us)} icon={flagUs} />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.boardContainer}>
          <div className={styles.board}>board</div>
        </div>
        <div className={styles.sidebar}>
          <Well className={styles.dictionary}>dictionary</Well>
          <Well className={styles.results}>results</Well>
        </div>
      </div>

      <div className={styles.tilesContainer}>tiles</div>
    </div>
  );
};

export default Index;
