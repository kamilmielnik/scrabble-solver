import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectIsShown } from 'splash/selectors';
import Copyright from 'components/copyright';
import Footer from 'components/footer';
import Board from 'board/components';
import Config from 'config/components';
import DictionaryInput from 'dictionary/components/input';
import DictionaryOutput from 'dictionary/components/output';
import RemainingTiles from 'remaining-tiles/components';
import ResultsFilter from 'results/components/filter';
import ResultsList from 'results/components/list';
import Splash from 'splash/components';
import Tiles from 'tiles/components';
import Time from 'time/components';
import Walkthrough from 'walkthrough/components';
import styles from './app.module.scss';

const App = ({ isSplashShown }) => (
  <div className={styles.app}>
    <div className={styles.contentContainer}>
      {!isSplashShown && (
        <Fragment>
          <div className={styles.content}>
            <div className={styles.left}>
              <Tiles />
              <Board />
              <DictionaryOutput />
              <DictionaryInput />
            </div>
            <div className={styles.right}>
              <ResultsList />
              <ResultsFilter />
            </div>

            <RemainingTiles className={styles.remainingTiles} />

            <div className={styles.bar}>
              <Copyright />
              <Config />
            </div>

            <Time className={styles.time} />
          </div>

          <Walkthrough />
        </Fragment>
      )}

      {isSplashShown && <Splash />}
    </div>

    <Footer />
  </div>
);

App.propTypes = {
  isSplashShown: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isSplashShown: selectIsShown(state)
});

export default connect(mapStateToProps)(App);
