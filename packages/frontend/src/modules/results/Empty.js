import React from 'react';

import { useMessage } from 'i18n';

import styles from './Results.module.scss';

const Empty = () => {
  const message = useMessage({ id: 'components.no-results' });

  return (
    <div className={styles.empty}>
      <div className={styles.icon}>👀</div>
      <div>{message}</div>
    </div>
  );
};

export default Empty;
