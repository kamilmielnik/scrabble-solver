import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Spinner from './spinner';
import styles from './styles.scss';

const Loading = ({ className, isLoading }) => isLoading ? (
  <div className={classNames(styles.loading, className)}>
    <Spinner className={styles.spinner} />
  </div>
) : null;

Loading.propTypes = {
  className: PropTypes.string,
  isLoading: PropTypes.bool
};

export default Loading;
