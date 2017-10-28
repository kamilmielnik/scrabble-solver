import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
  selectDefinitions,
  selectDefinitionsWord,
  selectIsAllowed,
  selectIsLoading
} from 'dictionary/selectors';
import Loading from 'components/loading';
import NoResults from 'components/no-results';
import Section from 'components/section';
import styles from './styles.scss';

const DictionaryOutput = ({ className, definitions, isAllowed, isLoading, word }) => (
  <Section
    className={className}
    label={(
      <FormattedMessage id="modules.dictionary.output.label" />
    )}>
    <div
      className={classNames(
        styles.dictionaryOutput,
        {
          [styles.isAllowed]: isAllowed === true,
          [styles.isNotAllowed]: isAllowed === false
        }
      )}>
      <div className={styles.word}>
        {word}
      </div>

      {isAllowed === false && (
        <div>
          <FormattedMessage id="modules.dictionary.output.cannot-find-definition" />
        </div>
      )}

      {isAllowed === true && definitions.map((result, index) => (
        <div key={index}>
          - {result}
        </div>
      ))}

      {isAllowed === null && (
        <NoResults />
      )}

      <Loading isLoading={isLoading} />
    </div>
  </Section>
);

DictionaryOutput.propTypes = {
  className: PropTypes.string,
  definitions: PropTypes.array.isRequired,
  isAllowed: PropTypes.bool,
  isLoading: PropTypes.bool,
  word: PropTypes.string
};

const mapStateToProps = (state) => ({
  definitions: selectDefinitions(state),
  isAllowed: selectIsAllowed(state),
  isLoading: selectIsLoading(state),
  word: selectDefinitionsWord(state)
});

export default connect(mapStateToProps)(DictionaryOutput);
