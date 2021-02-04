import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { useTranslate } from 'state';

import styles from './Results.module.scss';

const Header = (): ReactElement => {
  const translate = useTranslate();

  return (
    <div className={styles.header}>
      <div className={classNames(styles.cell, styles.word)}>{translate('results.header.word')}</div>
      <div className={classNames(styles.cell, styles.stat)} title={translate('results.header.tiles')}>
        #{translate('results.header.tiles')[0]}
      </div>
      <div className={classNames(styles.cell, styles.stat)} title={translate('results.header.blanks')}>
        #{translate('results.header.blanks')[0]}
      </div>
      <div className={classNames(styles.cell, styles.stat)} title={translate('results.header.collisions')}>
        #{translate('results.header.collisions')[0]}
      </div>
      <div className={classNames(styles.cell, styles.points)}>{translate('results.header.points')}</div>
    </div>
  );
};

export default Header;
