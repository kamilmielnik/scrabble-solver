import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Spinner from './spinner';
import styles from './loading.module.scss';

const Loading = ({ children, className, isLoading }) => (
  <div className={classNames(styles.loading, className)}>
    {children}
    {isLoading && (
      <div className={styles.dim}>
        <Spinner className={styles.spinner} />
      </div>
    )}
  </div>
);

Loading.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isLoading: PropTypes.bool
};

export default Loading;
