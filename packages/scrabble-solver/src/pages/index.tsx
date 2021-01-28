import classNames from 'classnames';
import fs from 'fs';
import path from 'path';
import React, { AnimationEvent, FormEventHandler, FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce, useMeasure } from 'react-use';

import { Board, Dictionary, KeyMap, Logo, NavButtons, Rack, Results, Settings, Splash, Well } from 'components';
import { useIsTablet, useLocalStorage } from 'hooks';
import { getCellSize } from 'lib';
import { COMPONENTS_SPACING, COMPONENTS_SPACING_MOBILE, DICTIONARY_HEIGHT } from 'parameters';
import { initialize, localStorage, reset, selectConfig, solveSlice, useTypedSelector } from 'state';

import styles from './index.module.scss';

interface Props {
  version: string;
}

const Index: FunctionComponent<Props> = ({ version }) => {
  const dispatch = useDispatch();
  const [showKeyMap, setShowKeyMap] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [boardRef, { height: boardHeight }] = useMeasure<HTMLDivElement>();
  const [contentRef, { height: contentHeight, width: contentWidth }] = useMeasure<HTMLDivElement>();
  const [
    resultsContainerRef,
    { height: resultsContainerHeight, width: resultsContainerWidth },
  ] = useMeasure<HTMLDivElement>();
  const config = useTypedSelector(selectConfig);
  const cellSize = getCellSize(config, contentWidth - resultsContainerWidth, contentHeight);
  const isInitialized = contentWidth > 0 && boardHeight > 0 && resultsContainerWidth > 0;
  const isTablet = useIsTablet();
  const resultsHeight = boardHeight - DICTIONARY_HEIGHT - (isTablet ? COMPONENTS_SPACING_MOBILE : COMPONENTS_SPACING);

  const handleClear = () => {
    dispatch(reset());
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
            <div className={styles.boardContainer}>
              {contentWidth > 0 && <Board cellSize={cellSize} innerRef={boardRef} />}
            </div>

            <div className={styles.sidebar} style={{ height: boardHeight + 1 }}>
              <Well className={styles.resultsContainer} ref={resultsContainerRef}>
                {resultsContainerWidth > 0 && resultsContainerHeight > 0 && (
                  <Results height={resultsHeight} width={resultsContainerWidth} />
                )}
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
