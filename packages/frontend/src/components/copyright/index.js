import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './copyright.module.scss';

const getCurrentYear = () => new Date().getFullYear();
const homepageUrl = 'http://kamilmielnik.com/';

const Copyright = ({ className }) => (
  <div className={classNames(styles.copyright, className)}>
    Copyright © {getCurrentYear()}
    &nbsp;
    <a className={styles.link} href={homepageUrl}>
      Kamil Mielnik
    </a>
  </div>
);

Copyright.propTypes = {
  className: PropTypes.string
};

export default Copyright;
