import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './section.module.scss';

const Section = ({ children, className, id, label }) => (
  <div className={classNames(styles.section, className)} id={id}>
    <div className={styles.label}>
      {label}
    </div>

    {children}
  </div>
);

Section.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.node.isRequired
};

export default Section;
