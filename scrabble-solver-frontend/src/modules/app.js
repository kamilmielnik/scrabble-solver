import React from 'react';
import Sidebar from 'sidebar';
import Copyright from 'components/copyright';
import Board from './board/components';
import Config from './config/components';
import DictionaryInput from './dictionary/components/input';
import DictionaryOutput from './dictionary/components/output';
import RemainingTiles from './remaining-tiles/components';
import ResultsFilter from './results/components/filter';
import ResultsList from './results/components/list';
import ShowWalkthrough from './walkthrough/components/show';
import Splash from './splash/components';
import Tiles from './tiles/components';
import Time from './time/components';
import Walkthrough from './walkthrough/components';
import styles from './styles.scss';

const App = () => (
  <div className={styles.app}>
    <Sidebar contentClassName={styles.sidebarContent} triggerClassName={styles.sidebarTrigger}>
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

        <RemainingTiles className={styles.remainingTiles} />

        <div className={styles.bar}>
          <Copyright />
          <Config />
        </div>

        <Time className={styles.time} />
      </div>

      <div className={styles.buttons}>
        <ShowWalkthrough />
      </div>

      <Splash />
    </Sidebar>
    <Walkthrough />
  </div>
);

export default App;
