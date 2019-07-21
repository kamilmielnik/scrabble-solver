import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { selectDefinitions, selectDefinitionsWord, selectIsAllowed, selectIsLoading } from 'dictionary/selectors';
import Loading from 'components/loading';
import NoResults from 'components/no-results';
import Section from 'components/section';
import { Message } from 'i18n';

import styles from './dictionary-output.module.scss';

const DictionaryOutput = ({ className, definitions, isAllowed, isLoading, word }) => (
  <Section className={className} id="dictionary-results" label={<Message id="modules.dictionary.output.label" />}>
    <Loading isLoading={isLoading}>
      <div
        className={classNames(styles.dictionaryOutput, {
          [styles.isAllowed]: isAllowed === true,
          [styles.isNotAllowed]: isAllowed === false
        })}
      >
        <div className={styles.word}>{word}</div>

        {isAllowed === false && (
          <div>
            <Message id="modules.dictionary.output.cannot-find-definition" />
          </div>
        )}

        {isAllowed === true && definitions.map((result, index) => <div key={index}>- {result}</div>)}

        {isAllowed === null && <NoResults />}
      </div>
    </Loading>
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
