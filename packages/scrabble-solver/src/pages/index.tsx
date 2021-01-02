import { Config } from '@scrabble-solver/models';
import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { useSize } from 'react-use';

import { Board, Dictionary, LocaleDropdown, Logo, Results, Splash, Tiles, Well } from 'components';
import { i18nSlice, selectConfig, selectLocale, useTypedSelector } from 'state';
import { Locale } from 'types';

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
  const dispatch = useDispatch();
  const [contentSizer, { width: contentWidth }] = useSize(<div />, INITIAL_SIZE);
  const [boardSizer, { height: boardHeight }] = useSize(<div />, INITIAL_SIZE);
  const [resultsSizer, { height: resultsHeight, width: resultsWidth }] = useSize(<div />, INITIAL_SIZE);
  const config = useTypedSelector(selectConfig);
  const locale = useTypedSelector(selectLocale);
  const cellSize = getCellSize(config, contentWidth - resultsWidth - SIDEBAR_MARGIN_LEFT, boardHeight);
  const isInitialized =
    contentWidth !== INITIAL_SIZE.width && boardHeight !== INITIAL_SIZE.height && resultsWidth !== INITIAL_SIZE.width;

  const handleLocaleChange = (newLocale: Locale) => {
    dispatch(i18nSlice.actions.changeLocale(newLocale));
  };

  return (
    <>
      <div className={classNames(styles.index, { [styles.initialized]: isInitialized })}>
        <div className={styles.nav}>
          <div className={styles.logoContainer}>
            <Logo className={styles.logo} />
          </div>

          <LocaleDropdown className={styles.flags} onChange={handleLocaleChange} value={locale} />
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            {contentSizer}

            <div className={styles.boardContainer}>
              {boardSizer}

              {contentWidth > 0 && boardHeight > 0 && <Board cellSize={cellSize} />}
            </div>

            <div className={styles.sidebar}>
              <Well className={styles.dictionary}>
                <Dictionary />
              </Well>

              <Well className={styles.results}>
                {resultsSizer}

                {resultsWidth > 0 && resultsHeight > 0 && <Results height={resultsHeight} width={resultsWidth} />}
              </Well>
            </div>
          </div>
        </div>

        <div className={styles.tilesContainer}>
          <Tiles />
        </div>
      </div>

      <Splash forceShow={!isInitialized} />
    </>
  );
};

export default Index;
