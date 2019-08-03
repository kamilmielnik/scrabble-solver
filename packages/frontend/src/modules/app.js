import React from 'react';
import { useWindowSize } from 'react-use';

import { ConfigSetting } from 'config';
import { Board } from 'board';
import { LocaleSetting } from 'i18n';
import { Results } from 'results';
import { Tiles } from 'tiles';
import { ShowWalkthrough, Walkthrough } from 'walkthrough';

import styles from './app.module.scss';

const App = () => {
  const { width, height } = useWindowSize();

  return (
    <div className={styles.app}>
      <div className={styles.content}>
        <div className={styles.menu}>
          <ConfigSetting />

          <div className={styles.menuRight}>
            <LocaleSetting />

            <div className={styles.walkthrough}>
              <ShowWalkthrough />
            </div>
          </div>
        </div>

        <div className={styles.board}>
          <Board />
        </div>

        <div className={styles.tiles}>
          <Tiles id="tiles" />
        </div>
      </div>

      <div className={styles.sidebar}>
        <Results height={height} width={Math.max(width * 0.2, 200)} />
      </div>

      <Walkthrough />
    </div>
  );
};

export default App;
