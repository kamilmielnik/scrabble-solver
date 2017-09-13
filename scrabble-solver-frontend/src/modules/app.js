import React from 'react';
import Copyright from 'components/copyright';
import Board from './board/components';
import Config from './config/components';
import DictionaryInput from './dictionary/components/input';
import DictionaryOutput from './dictionary/components/output';
import RemainingTiles from './remaining-tiles/components';
import ResultsFilter from './results/components/filter';
import ResultsList from './results/components/list';
import Tiles from './tiles/components';
import Time from './time/components';
import styles from './styles.scss';

const App = () => (
  <div className={styles.app}>
    <div className={styles.content}>
      <div className={styles.left}>
        <Tiles />
        <Board />
        <DictionaryOutput />
        <DictionaryInput />
      </div>
      <div className={styles.right}>
        <ResultsList />
        <ResultsFilter />
      </div>
    </div>

    <div className={styles.bar}>
      <RemainingTiles className={styles.remaining} />
      <Copyright />
      <Config />
    </div>

    <Time />
  </div>
);

export default App;
