import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { unhighlightResult } from 'results/state';
import { selectIsLoading } from 'shared/selectors';
import Loading from 'components/loading';
import Section from 'components/section';

import ResultsTable from './table';
import styles from './results-list.module.scss';

const ResultsList = ({ height, isLoading, onMouseLeave }) => (
  <Loading isLoading={isLoading}>
    <div className={styles.results} onMouseLeave={onMouseLeave}>
      <ResultsTable height={height} />
    </div>
  </Loading>
);

ResultsList.propTypes = {
  height: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
  onMouseLeave: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  isLoading: selectIsLoading(state)
});

const mapDispatchToProps = (dispatch) => ({
  onMouseLeave: () => dispatch(unhighlightResult())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultsList);
