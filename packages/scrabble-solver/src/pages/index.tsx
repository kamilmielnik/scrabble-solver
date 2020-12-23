import { literaki, scrabble } from '@scrabble-solver/configs';
import { Config, Tile as TileModel } from '@scrabble-solver/models';
import React, { FunctionComponent, useState } from 'react';
import { useSize } from 'react-use';

import { LocaleDropdown, Tile, Well } from 'components';
import { detectLocale, noop } from 'lib';
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

const Index: FunctionComponent = () => {
  const [locale, setLocale] = useState<Locale>(detectLocale());
  const [sizer, { height, width }] = useSize(<div className={styles.boardSizer} />, { height: 0, width: 0 });
  const cellSize = Math.floor(Math.min(height, width) / 15); // TODO: unhardcode 15
  const config = getConfig(locale, 'literaki'); // TODO: unhardcode 'literaki'

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

            {width > 0 && height > 0 && (
              <span>
                Board: {width}x{height}, Cell: {cellSize}x{cellSize}
                <Tile
                  config={config}
                  size={cellSize}
                  tile={new TileModel({ character: 'W' })}
                  onFocus={noop}
                  onKeyDown={noop}
                />
              </span>
            )}
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
