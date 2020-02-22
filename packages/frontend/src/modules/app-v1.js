import React from 'react';

import Board from 'board/components';
import Config from 'config/components';
import RemainingTiles from 'remaining-tiles/components';
import ResultsFilter from 'results/components/filter';
import ResultsList from 'results/components/list';
import { Tiles } from 'tiles';
import Time from 'time/components';
import Walkthrough from 'walkthrough/components';

import styles from './app-v1.module.scss';

const App = () => (
  <div className={styles.app}>
    <div className={styles.contentContainer}>
      <div className={styles.content}>
        <div className={styles.left}>
          <Board />
        </div>
        <div className={styles.right}>
          <ResultsList />
          <ResultsFilter />
        </div>

        <RemainingTiles className={styles.remainingTiles} />

        <div className={styles.bar}>
          <Config />
        </div>

        <Time className={styles.time} />
      </div>

      <Tiles />

      <Walkthrough />
    </div>
  </div>
);

export default App;
