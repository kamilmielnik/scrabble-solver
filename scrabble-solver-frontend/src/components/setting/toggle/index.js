import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './toggle.module.scss';

const Toggle = ({ children, className, isActive, ...restProps }) => (
  <div
    className={classNames(
      styles.toggle,
      {
        [styles.active]: isActive
      },
      className
    )}
    {...restProps}>
    {children}
  </div>
);

Toggle.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
  isActive: PropTypes.bool
};

export default Toggle;
