import classNames from 'classnames';
import { FunctionComponent } from 'react';

import { useAppLayout } from 'hooks';
import { selectDictionary, selectDictionaryError, useTranslate, useTypedSelector } from 'state';

import EmptyState from '../EmptyState';
import Loading from '../Loading';

import styles from './Dictionary.module.scss';

interface Props {
  className?: string;
}

const Dictionary: FunctionComponent<Props> = ({ className }) => {
  const translate = useTranslate();
  const { dictionaryResultsHeight } = useAppLayout();
  const { results, isLoading } = useTypedSelector(selectDictionary);
  const error = useTypedSelector(selectDictionaryError);
  const isLastAllowed = results.at(-1)?.isAllowed;

  return (
    <div
      className={classNames(styles.dictionary, className, {
        [styles.isAllowed]: isLastAllowed === true,
        [styles.isNotAllowed]: isLastAllowed === false,
      })}
      style={{ height: dictionaryResultsHeight }}
    >
      <div className={styles.content}>
        {typeof error !== 'undefined' && !isLoading && <EmptyState variant="error">{error.message}</EmptyState>}

        {typeof error === 'undefined' && !isLoading && results.length === 0 && (
          <EmptyState variant="info">{translate('dictionary.empty-state.uninitialized')}</EmptyState>
        )}

        {results.map(({ definitions, exists, isAllowed, word }) => (
          <div
            className={classNames(styles.result, {
              [styles.isAllowed]: isAllowed === true,
              [styles.isNotAllowed]: isAllowed === false,
            })}
            key={word}
          >
            <div className={styles.resultContent}>
              {word && <h2 className={styles.word}>{word}</h2>}

              {isAllowed === false && <div>{translate('dictionary.empty-state.not-allowed')}</div>}

              {isAllowed === true && definitions.length === 0 && (
                <>
                  <div>
                    {exists
                      ? translate('dictionary.empty-state.no-definitions')
                      : translate('dictionary.empty-state.no-results')}
                  </div>
                </>
              )}

              {isAllowed === true && definitions.length > 0 && (
                <ul className={styles.definitions}>
                  {definitions.map((result, index) => (
                    <li key={index} className={styles.definition}>
                      {result}
                    </li>
                  ))}
                </ul>
              )}

              {!isLoading && isAllowed === null && <div>{translate('dictionary.empty-state.no-results')}</div>}
            </div>
          </div>
        ))}
      </div>

      {isLoading && <Loading />}
    </div>
  );
};

export default Dictionary;
