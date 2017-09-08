import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

const Section = ({ children, className, label }) => (
  <div className={classNames(styles.section, className)}>
    <div className={styles.label}>
      {label}
    </div>

    {children}
  </div>
);

Section.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  label: PropTypes.node.isRequired
};

export default Section;
