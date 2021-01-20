import { Config } from '@scrabble-solver/types';
import classNames from 'classnames';
import fs from 'fs';
import path from 'path';
import React, { AnimationEvent, FormEventHandler, FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce, useMeasure } from 'react-use';

import { Board, Dictionary, KeyMap, Logo, NavButtons, Results, Settings, Splash, Tiles, Well } from 'components';
import { BOARD_TILE_SIZE_MAX, BOARD_TILE_SIZE_MIN, COMPONENTS_SPACING } from 'const';
import { useLocalStorage } from 'hooks';
import {
  boardSlice,
  dictionarySlice,
  initialize,
  localStorage,
  resultsSlice,
  selectConfig,
  solveSlice,
  tilesSlice,
  useTypedSelector,
} from 'state';

import styles from './index.module.scss';

const getCellSize = (config: Config, width: number, height: number): number => {
  const cellBorderWidth = 1; // TODO: unhardcode
  const maxWidth = (width - cellBorderWidth) / config.boardWidth - cellBorderWidth;
  const maxHeight = (height - cellBorderWidth) / config.boardHeight - cellBorderWidth;
  const cellSize = Math.min(maxWidth, maxHeight);
  return Math.min(Math.max(cellSize, BOARD_TILE_SIZE_MIN), BOARD_TILE_SIZE_MAX);
};

const getVersion = (): string => {
  const packageJsonFilepath = path.resolve(process.cwd(), 'package.json');
  const packageJsonFile = fs.readFileSync(packageJsonFilepath, 'utf-8');
  const packageJson = JSON.parse(packageJsonFile);
  return packageJson.version;
};

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
    dispatch(resultsSlice.actions.reset());
    dispatch(tilesSlice.actions.reset());
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

        <div className={styles.tilesContainer}>
          <Tiles className={styles.tiles} />
        </div>
      </form>

      <Settings hidden={!showSettings} onClose={handleHideSettings} />

      <KeyMap hidden={!showKeyMap} onClose={handleHideKeyMap} />

      <Splash forceShow={!isInitialized} onAnimationEnd={handleSplashAnimationEnd} />
    </>
  );
};

export const getStaticProps = async () => {
  const props: Props = {
    version: getVersion(),
  };

  return { props };
};

export default Index;
