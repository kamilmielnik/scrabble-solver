import React from 'react';

import Board from 'board/components';
import ResultsList from 'results/components/list';
import { Tiles } from 'tiles';

import styles from './app.module.scss';

const App = () => (
  <div className={styles.app}>
    <div className={styles.content}>
      <div className={styles.boardContainer}>
        <Board />
      </div>

      <div className={styles.sidebar}>
        <ResultsList />
      </div>
    </div>

    <div className={styles.tiles}>
      <Tiles />
    </div>
  </div>
);

export default App;
