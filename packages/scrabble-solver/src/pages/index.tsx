import { literaki, scrabble } from '@scrabble-solver/configs';
import { Config } from '@scrabble-solver/models';
import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { useSize } from 'react-use';

import { Board, LocaleDropdown, Well } from 'components';
import { i18n, selectConfig, selectLocale, useTypedSelector } from 'state';
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
  const maxWidth = (width - cellBorderWidth) / config.boardWidth - 2 * cellBorderWidth;
  const maxHeight = (height - cellBorderWidth) / config.boardHeight - 2 * cellBorderWidth;
  const cellSize = Math.min(maxWidth, maxHeight);
  return Math.floor(cellSize);
};

const Index: FunctionComponent = () => {
  const dispatch = useDispatch();
  const [sizer, { height, width }] = useSize(<div className={styles.boardSizer} />, { height: 0, width: 0 });
  const config = useTypedSelector(selectConfig);
  const locale = useTypedSelector(selectLocale);
  const cellSize = getCellSize(config, width, height);

  const handleLocaleChange = (newLocale: Locale) => {
    dispatch(i18n.actions.changeLocale(newLocale));
  };

  return (
    <div className={styles.index}>
      <div className={styles.nav}>
        <h1 className={styles.title}>Scrabble Solver by Kamil Mielnik ({locale})</h1>

        <LocaleDropdown className={styles.flags} onChange={handleLocaleChange} value={locale} />
      </div>

      <div className={styles.content}>
        <div className={styles.boardContainer}>
          {sizer}

          {width > 0 && height > 0 && <Board className={styles.board} cellSize={cellSize} />}
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
