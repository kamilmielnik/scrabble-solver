import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Copyright from 'components/copyright';
import Locales from './locales';
import styles from './splash.module.scss';

const Splash = ({ className }) => (
  <div className={classNames(styles.splash, className)}>
    <div className={styles.content}>
      <div className={styles.title}>
        Scrabble Solver
      </div>

      <Locales />

      <div className={styles.copyright}>
        <Copyright />
      </div>
    </div>
  </div>
);

Splash.propTypes = {
  className: PropTypes.string
};

export default Splash;
