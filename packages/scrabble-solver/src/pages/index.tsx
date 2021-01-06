import { Config } from '@scrabble-solver/models';
import classNames from 'classnames';
import React, { FunctionComponent, useState } from 'react';
import { useSize } from 'react-use';

import { Board, Dictionary, Logo, Results, Settings, SettingsButton, Splash, Tiles, Well } from 'components';
import { useLocalStorage } from 'hooks';
import { selectConfig, useTypedSelector } from 'state';

import styles from './index.module.scss';

// TODO: moove to constants?
const MIN_TILE_SIZE = 20;
const MAX_TILE_SIZE = 60;
const SIDEBAR_MARGIN_LEFT = 40; // TODO: unhardcode?

const INITIAL_SIZE = { height: 0, width: 0 };

const getCellSize = (config: Config, width: number, height: number): number => {
  const cellBorderWidth = 1; // TODO: unhardcode
  const maxWidth = (width - cellBorderWidth) / config.boardWidth - cellBorderWidth;
  const maxHeight = (height - cellBorderWidth) / config.boardHeight - cellBorderWidth;
  const cellSize = Math.min(maxWidth, maxHeight);
  return Math.min(Math.max(cellSize, MIN_TILE_SIZE), MAX_TILE_SIZE);
};

const Index: FunctionComponent = () => {
  useLocalStorage();
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [contentSizer, { width: contentWidth }] = useSize(<div />, INITIAL_SIZE);
  const [boardSizer, { height: boardHeight }] = useSize(<div />, INITIAL_SIZE);
  const [resultsSizer, { height: resultsHeight, width: resultsWidth }] = useSize(<div />, INITIAL_SIZE);
  const config = useTypedSelector(selectConfig);
  const cellSize = getCellSize(config, contentWidth - resultsWidth - SIDEBAR_MARGIN_LEFT, boardHeight);
  const isInitialized =
    contentWidth !== INITIAL_SIZE.width && boardHeight !== INITIAL_SIZE.height && resultsWidth !== INITIAL_SIZE.width;

  const handleShowSettings = () => setShowSettings(true);

  return (
    <>
      <div className={classNames(styles.index, { [styles.initialized]: isInitialized })}>
        <div className={styles.nav}>
          <div className={styles.logoContainer}>
            <Logo className={styles.logo} />
          </div>

          <SettingsButton className={styles.settingsButton} onClick={handleShowSettings} />
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            {contentSizer}

            <div className={styles.boardContainer}>
              {boardSizer}

              {contentWidth > 0 && boardHeight > 0 && <Board cellSize={cellSize} />}
            </div>

            <div className={styles.sidebar}>
              <Well className={styles.results}>
                {resultsSizer}

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
      </div>

      <Settings hidden={!showSettings} />

      <Splash forceShow={!isInitialized} />
    </>
  );
};

export default Index;
