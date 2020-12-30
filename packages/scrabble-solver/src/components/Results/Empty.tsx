import React, { FunctionComponent } from 'react';

import { useTranslation } from 'state';

import styles from './Results.module.scss';

const Empty: FunctionComponent = () => {
  const caption = useTranslation('components.no-results');

  return (
    <div className={styles.empty}>
      <div className={styles.icon}>
        <span role="img" aria-hidden>
          👀
        </span>
      </div>

      <div>{caption}</div>
    </div>
  );
};

export default Empty;
