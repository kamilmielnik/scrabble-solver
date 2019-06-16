import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { unhighlightResult } from 'results/state';
import { selectIsLoading } from 'shared/selectors';
import Loading from 'components/loading';
import Section from 'components/section';
import { Message } from 'i18n/components';
import ResultsTable from './table';
import styles from './results-list.module.scss';

const ResultsList = ({ className, isLoading, onMouseLeave }) => (
  <Section
    className={className}
    id="results"
    label={(
      <Message id="modules.results.label" />
    )}>
    <div className={styles.results} onMouseLeave={onMouseLeave}>
      <ResultsTable />
      <Loading isLoading={isLoading} />
    </div>
  </Section>
);

ResultsList.propTypes = {
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  onMouseLeave: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  isLoading: selectIsLoading(state)
});

const mapDispatchToProps = (dispatch) => ({
  onMouseLeave: () => dispatch(unhighlightResult())
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultsList);
