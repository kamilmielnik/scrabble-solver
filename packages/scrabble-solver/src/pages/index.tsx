import { literaki, scrabble } from '@scrabble-solver/configs';
import { Config } from '@scrabble-solver/models';
import React, { FunctionComponent, useState } from 'react';
import { useSize } from 'react-use';

import { Board, LocaleDropdown, Well } from 'components';
import { detectLocale } from 'lib';
import { Locale } from 'types';

import styles from './index.module.scss';

const getConfig = (locale: Locale, configId: string): Config => {
  const config = [literaki, scrabble].find(({ id }) => id === configId);

  if (!config) {
    throw new Error('Cannot find config');
  }

  const localeConfig = config[locale];

  if (!localeConfig) {
    throw new Error('Cannot find config');
  }

  return localeConfig;
};

const getCellSize = (config: Config, width: number, height: number): number => {
  const cellBorderWidth = 1; // TODO: unhardcode
  const maxWidth = width / config.boardWidth - 2 * cellBorderWidth;
  const maxHeight = height / config.boardHeight - 2 * cellBorderWidth;
  const cellSize = Math.min(maxWidth, maxHeight);
  return Math.floor(cellSize);
};

const Index: FunctionComponent = () => {
  const [locale, setLocale] = useState<Locale>(detectLocale());
  const [sizer, { height, width }] = useSize(<div className={styles.boardSizer} />, { height: 0, width: 0 });
  const config = getConfig(locale, 'literaki'); // TODO: unhardcode 'literaki'
  const cellSize = getCellSize(config, width, height);

  return (
    <div className={styles.index}>
      <div className={styles.nav}>
        <h1 className={styles.title}>Scrabble Solver by Kamil Mielnik ({locale})</h1>

        <LocaleDropdown className={styles.flags} onChange={setLocale} value={locale} />
      </div>

      <div className={styles.content}>
        <div className={styles.boardContainer}>
          <div className={styles.board}>
            {sizer}

            {width > 0 && height > 0 && <Board cellSize={cellSize} />}
          </div>
        </div>

        <div className={styles.sidebar}>
          <Well className={styles.dictionary}>dictionary</Well>
          <Well className={styles.results}>results</Well>
        </div>
      </div>

      <div className={styles.tilesContainer}>tiles</div>
    </div>
  );
};

export default Index;
