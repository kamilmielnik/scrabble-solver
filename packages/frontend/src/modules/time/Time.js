import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useTime } from './hooks';
import styles from './Time.module.scss';

const Time = ({ className }) => {
  const time = useTime();

  return <div className={classNames(styles.time, className)}>{time}</div>;
};

Time.propTypes = {
  className: PropTypes.string
};

export default Time;
