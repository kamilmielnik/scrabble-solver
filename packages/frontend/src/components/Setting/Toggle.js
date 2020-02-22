import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Toggle.module.scss';

const Toggle = ({ active, children, className, onClick }) => (
  <div
    className={classNames(styles.toggle, className, {
      [styles.active]: active
    })}
    onClick={onClick}
  >
    {children}
  </div>
);

Toggle.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default Toggle;
