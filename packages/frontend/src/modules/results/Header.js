import React from 'react';

import styles from './Results.module.scss';

const Header = () => (
  <div className={styles.header}>
    <div className={styles.cell}>Word</div>
    <div className={styles.cell}>Points</div>
  </div>
);

export default Header;
