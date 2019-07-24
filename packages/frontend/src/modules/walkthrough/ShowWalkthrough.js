import React from 'react';
import { useDispatch } from 'react-redux';

import { QuestionMark } from 'components/icons';

import { showWalkthrough } from './state';
import styles from './ShowWalkthrough.module.scss';

const ShowWalkthrough = () => {
  const dispatch = useDispatch();

  return (
    <QuestionMark
      className={styles.showWalkthrough}
      onClick={() => {
        window.scrollTo(0, 0);
        dispatch(showWalkthrough());
      }}
    />
  );
};

export default ShowWalkthrough;
