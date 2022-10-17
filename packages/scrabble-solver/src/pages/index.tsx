import classNames from 'classnames';
import fs from 'fs';
import path from 'path';
import { AnimationEvent, FormEvent, FunctionComponent, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { useEffectOnce, useMeasure } from 'react-use';

import {
  Board,
  BoardV2,
  Dictionary,
  DictionaryInput,
  KeyMap,
  Logo,
  NavButtons,
  Rack,
  RemainingTiles,
  Results,
  Settings,
  Splash,
  Well,
  Words,
} from 'components';
import { useIsTablet, useLocalStorage } from 'hooks';
import { getCellSize } from 'lib';
import { COMPONENTS_SPACING, COMPONENTS_SPACING_MOBILE, DICTIONARY_HEIGHT } from 'parameters';
import { initialize, localStorage, reset, selectConfig, solveSlice, useTypedSelector } from 'state';

import styles from './index.module.scss';

Modal.setAppElement('#__next');

interface Props {
  version: string;
}

const Index: FunctionComponent<Props> = ({ version }) => {
  const dispatch = useDispatch();
  const isTablet = useIsTablet();
  const [showKeyMap, setShowKeyMap] = useState(false);
  const [showRemainingTiles, setShowRemainingTiles] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWords, setShowWords] = useState(false);
  const [boardRef, { height: boardHeight }] = useMeasure<HTMLDivElement>();
  const [contentRef, { height: contentHeight, width: contentWidth }] = useMeasure<HTMLDivElement>();
  const [resultsContainerRef, { height: resultsContainerHeight, width: resultsContainerWidth }] =
    useMeasure<HTMLDivElement>();
  const config = useTypedSelector(selectConfig);
  const cellSize = getCellSize(config, contentWidth - resultsContainerWidth, contentHeight);
  const isInitialized = contentWidth > 0 && boardHeight > 0 && resultsContainerWidth > 0;
  const resultsHeight = boardHeight - DICTIONARY_HEIGHT - (isTablet ? COMPONENTS_SPACING_MOBILE : COMPONENTS_SPACING);

  const handleClear = () => {
    dispatch(reset());
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(solveSlice.actions.submit());
  };

  const handleSplashAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !localStorage.getHasVisited()) {
      setShowSettings(true);
      localStorage.setHasVisited(true);
    }
  };

  useLocalStorage();

  useEffectOnce(() => {
    dispatch(initialize());
  });

  return (
    <>
      <div className={classNames(styles.index, { [styles.initialized]: isInitialized })}>
        <div className={styles.nav}>
          <div className={styles.navLogo}>
            <a className={styles.logoContainer} href="/" title={version}>
              <Logo className={styles.logo} />
            </a>
          </div>

          <NavButtons
            onClear={handleClear}
            onShowKeyMap={() => setShowKeyMap(true)}
            onShowRemainingTiles={() => setShowRemainingTiles(true)}
            onShowSettings={() => setShowSettings(true)}
            onShowWords={() => setShowWords(true)}
          />
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.content} ref={contentRef}>
            <form className={styles.boardContainer} onSubmit={handleSubmit}>
              {contentWidth > 0 && <Board cellSize={cellSize} innerRef={boardRef} />}
              {contentWidth > 0 && <BoardV2 cellSize={cellSize} /* innerRef={boardRef} */ />}
              <input className={styles.submitInput} tabIndex={-1} type="submit" />
            </form>

            <div className={styles.sidebar} style={{ height: boardHeight + 1 }}>
              <Well className={styles.resultsContainer} ref={resultsContainerRef}>
                {resultsContainerWidth > 0 && resultsContainerHeight > 0 && (
                  <Results height={resultsHeight} width={resultsContainerWidth} />
                )}
              </Well>

              <Well>
                <div className={styles.dictionary} style={{ height: DICTIONARY_HEIGHT }}>
                  <Dictionary className={styles.dictionaryOutput} />
                  <DictionaryInput className={styles.dictionaryInput} />
                </div>
              </Well>
            </div>
          </div>
        </div>

        <form className={styles.rackContainer} onSubmit={handleSubmit}>
          <Rack className={styles.rack} />
          <input className={styles.submitInput} tabIndex={-1} type="submit" />
        </form>
      </div>

      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />

      <KeyMap isOpen={showKeyMap} onClose={() => setShowKeyMap(false)} />

      <Words isOpen={showWords} onClose={() => setShowWords(false)} />

      <RemainingTiles isOpen={showRemainingTiles} onClose={() => setShowRemainingTiles(false)} />

      <Splash forceShow={!isInitialized} onAnimationEnd={handleSplashAnimationEnd} />
    </>
  );
};

export const getStaticProps = async (): Promise<{ props: Props }> => {
  const version = await readVersion();
  return { props: { version } };
};

const readVersion = async (): Promise<string> => {
  const packageJsonFilepath = path.resolve(process.cwd(), 'package.json');
  const data = await fs.promises.readFile(packageJsonFilepath, 'utf-8');
  const packageJson = JSON.parse(data);
  return `v${packageJson.version}`;
};

export default Index;
