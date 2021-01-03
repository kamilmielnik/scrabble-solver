import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import { selectDictionaryRoot, useTranslation, useTypedSelector } from 'state';

import EmptyState from '../EmptyState';
import Loading from '../Loading';

import styles from './Dictionary.module.scss';

interface Props {
  className?: string;
}

const Dictionary: FunctionComponent<Props> = ({ className }) => {
  const { definitions, isAllowed, isLoading, word } = useTypedSelector(selectDictionaryRoot);
  const noResultsTranslation = useTranslation('dictionary.empty-state.no-results');
  const noDefinitionsTranslation = useTranslation('dictionary.empty-state.no-definitions');
  const notAllowedTranslation = useTranslation('dictionary.empty-state.not-allowed');
  const unitializedTranslation = useTranslation('dictionary.empty-state.unitialized');

  return (
    <div
      className={classNames(styles.dictionary, className, {
        [styles.isAllowed]: isAllowed === true,
        [styles.isNotAllowed]: isAllowed === false,
      })}
    >
      {typeof word === 'undefined' && <EmptyState type="info">{unitializedTranslation}</EmptyState>}

      {typeof word !== 'undefined' && (
        <div className={styles.content}>
          {word && <div className={styles.word}>{word}</div>}

          {isAllowed === false && <div>{notAllowedTranslation}</div>}

          {isAllowed === true && (
            <>
            {definitions.length === 0 && <div>{noDefinitionsTranslation}</div>}

              {definitions.length > 0 && (
                <ul className={styles.definitions}>
                  {definitions.map((result, index) => (
                    <li key={index} className={styles.definition}>
                      {result}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {!isLoading && isAllowed === null && <div>{noResultsTranslation}</div>}
        </div>
      )}

      {isLoading && <Loading />}
    </div>
  );
};

export default Dictionary;
