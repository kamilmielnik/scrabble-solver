import React from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';

import { ConfigSetting } from 'config';
import Board from 'board/components';
import { LocaleSetting } from 'i18n';
import { Results } from 'results';
import { Tiles } from 'tiles';
import { Time } from 'time';
import ShowWalkthrough from 'walkthrough/components/show';

import styles from './app.module.scss';

const App = () => {
  const { width, height } = useWindowSize();

  return (
    <div className={styles.app}>
      <div className={styles.content}>
        <div className={styles.menu}>
          <ConfigSetting />
          <Time />
          <ShowWalkthrough />
          <LocaleSetting />
        </div>

        <div className={styles.board}>
          <Board />
        </div>

        <div className={styles.tiles}>
          <Tiles />
        </div>
      </div>

      <div className={styles.sidebar}>
        <Results height={height} width={Math.max(width * 0.2, 200)} />
      </div>
    </div>
  );
};

export default App;
