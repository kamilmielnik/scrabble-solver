import React, { useState } from 'react';

import { LocaleDropdown, Well } from 'components';
import { detectLocale } from 'lib';
import { Locale } from 'types';

import styles from './index.module.scss';

const Index = () => {
  const [locale, setLocale] = useState<Locale>(detectLocale());

  return (
    <div className={styles.index}>
      <div className={styles.nav}>
        <h1 className={styles.title}>Scrabble Solver by Kamil Mielnik ({locale})</h1>

        <LocaleDropdown className={styles.flags} onChange={setLocale} value={locale} />
      </div>

      <div className={styles.content}>
        <div className={styles.boardContainer}>
          <div className={styles.board}>board</div>
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
