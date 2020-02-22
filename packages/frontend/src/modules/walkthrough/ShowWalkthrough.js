import React from 'react';

import { QuestionMark } from 'icons';

import { useShowWalkthrough } from './hooks';
import styles from './ShowWalkthrough.module.scss';

const ShowWalkthrough = () => {
  const showWalkthrough = useShowWalkthrough();

  return (
    <QuestionMark
      className={styles.showWalkthrough}
      onClick={() => {
        window.scrollTo(0, 0);
        showWalkthrough();
      }}
    />
  );
};

export default ShowWalkthrough;
