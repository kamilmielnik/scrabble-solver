import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './link.module.scss';

const Link = ({ children, className, ...restProps }) => (
  <a className={classNames(styles.link, className)} {...restProps}>
    {children}
  </a>
);

Link.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Link;
