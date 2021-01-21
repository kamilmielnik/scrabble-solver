import classNames from 'classnames';
import fs from 'fs';
import path from 'path';
import React, { AnimationEvent, FormEventHandler, FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce, useMeasure } from 'react-use';

import { Board, Dictionary, KeyMap, Logo, NavButtons, Rack, Results, Settings, Splash, Well } from 'components';
import { useLocalStorage } from 'hooks';
import { getCellSize } from 'lib';
import { COMPONENTS_SPACING } from 'parameters';
import {
  boardSlice,
  dictionarySlice,
  initialize,
  localStorage,
  rackSlice,
  resultsSlice,
  selectConfig,
  solveSlice,
  useTypedSelector,
} from 'state';

import styles from './index.module.scss';

interface Props {
  version: string;
}

const Index: FunctionComponent<Props> = ({ version }) => {
  const dispatch = useDispatch();
  const [showKeyMap, setShowKeyMap] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [boardRef, { height: boardHeight }] = useMeasure<HTMLDivElement>();
  const [contentRef, { width: contentWidth }] = useMeasure<HTMLDivElement>();
  const [resultsRef, { height: resultsHeight, width: resultsWidth }] = useMeasure<HTMLDivElement>();
  const config = useTypedSelector(selectConfig);
  const cellSize = getCellSize(config, contentWidth - resultsWidth - COMPONENTS_SPACING, boardHeight);
  const isInitialized = contentWidth > 0 && boardHeight > 0 && resultsWidth > 0;

  const handleClear = () => {
    dispatch(boardSlice.actions.reset());
    dispatch(dictionarySlice.actions.reset());
    dispatch(rackSlice.actions.reset());
    dispatch(resultsSlice.actions.reset());
  };

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    dispatch(solveSlice.actions.submit());
  };

  const handleSplashAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || localStorage.getHasVisited()) {
      return;
    }

    setShowSettings(true);
    localStorage.setHasVisited(true);
  };

  const handleHideKeyMap = () => setShowKeyMap(false);
  const handleShowKeyMap = () => setShowKeyMap(true);
  const handleHideSettings = () => setShowSettings(false);
  const handleShowSettings = () => setShowSettings(true);

  useLocalStorage();

  useEffectOnce(() => {
    dispatch(initialize());
  });

  return (
    <>
      <form className={classNames(styles.index, { [styles.initialized]: isInitialized })} onSubmit={handleSubmit}>
        <div className={styles.nav}>
          <div className={styles.logoContainer} title={`scrabble-solver@${version}`}>
            <Logo className={styles.logo} />
          </div>

          <NavButtons onClear={handleClear} onShowKeyMap={handleShowKeyMap} onShowSettings={handleShowSettings} />
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.content} ref={contentRef}>
            <div className={styles.boardContainer} ref={boardRef}>
              {contentWidth > 0 && boardHeight > 0 && <Board cellSize={cellSize} />}
            </div>

            <div className={styles.sidebar}>
              <Well className={styles.results} ref={resultsRef}>
                {resultsWidth > 0 && resultsHeight > 0 && <Results height={resultsHeight} width={resultsWidth} />}
              </Well>

              <Well className={styles.dictionary}>
                <Dictionary />
              </Well>
            </div>
          </div>
        </div>

        <div className={styles.rackContainer}>
          <Rack className={styles.rack} />
        </div>
      </form>

      <Settings hidden={!showSettings} onClose={handleHideSettings} />

      <KeyMap hidden={!showKeyMap} onClose={handleHideKeyMap} />

      <Splash forceShow={!isInitialized} onAnimationEnd={handleSplashAnimationEnd} />
    </>
  );
};

export const getStaticProps = async (): Promise<{ props: Props }> => {
  const version = await readVersion();
  return { props: { version } };
};

const readVersion = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const packageJsonFilepath = path.resolve(process.cwd(), 'package.json');

    fs.readFile(packageJsonFilepath, 'utf-8', (error, data) => {
      if (error) {
        reject(error);
        return;
      }

      const packageJson = JSON.parse(data);
      resolve(packageJson.version);
    });
  });
};

export default Index;
