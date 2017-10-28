import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { selectIsShown } from 'splash/selectors';
import Copyright from 'components/copyright';
import Locales from './locales';
import styles from './styles.scss';


const Splash = ({ className, isShown }) => (
  <div
    className={classNames(
      styles.splash,
      {
        [styles.hidden]: !isShown
      },
      className
    )}>
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
  className: PropTypes.string,
  isShown: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  isShown: selectIsShown(state)
});

export default connect(mapStateToProps)(Splash);
