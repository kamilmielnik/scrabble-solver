import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './button.module.scss';

const Button = ({ children, className, onClick }) => (
  <div className={classNames(styles.button, className)} onClick={onClick}>
    {children}
  </div>
);

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default Button;
