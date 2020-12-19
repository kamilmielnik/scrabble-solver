import React from 'react';

import styles from './index.module.scss';

const Index = () => {
  return (
    <div className={styles.index}>
      <div className={styles.content}></div>

      <div className={styles.sidebar}></div>
    </div>
  );
};

export default Index;
