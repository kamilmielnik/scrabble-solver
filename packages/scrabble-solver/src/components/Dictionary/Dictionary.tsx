import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import { selectDictionaryRoot, useTranslation, useTypedSelector } from 'state';

import Loading from '../Loading';

import styles from './Dictionary.module.scss';

interface Props {
  className?: string;
}

const Dictionary: FunctionComponent<Props> = ({ className }) => {
  const { definitions, isAllowed, isLoading, word } = useTypedSelector(selectDictionaryRoot);
  const noResultsTranslation = useTranslation('dictionary.empty-state.no-results');
  const notAllowedTranslation = useTranslation('dictionary.empty-state.not-allowed');

  return (
    <div
      className={classNames(styles.dictionary, className, {
        [styles.isAllowed]: isAllowed === true,
        [styles.isNotAllowed]: isAllowed === false,
      })}
    >
      {word && <div className={styles.word}>{word}</div>}

      {isAllowed === false && <div>{notAllowedTranslation}</div>}

      {isAllowed === true && (
        <ul className={styles.definitions}>
          {definitions.map((result, index) => (
            <li key={index} className={styles.definition}>
              {result}
            </li>
          ))}
        </ul>
      )}

      {!isLoading && isAllowed === null && <div>{noResultsTranslation}</div>}

      {isLoading && <Loading />}
    </div>
  );
};

export default Dictionary;
