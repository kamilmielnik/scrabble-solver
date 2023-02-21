import classNames from 'classnames';
import { FunctionComponent } from 'react';

import { selectDictionary, selectDictionaryError, useTranslate, useTypedSelector } from 'state';

import EmptyState from '../EmptyState';
import Loading from '../Loading';

import styles from './Dictionary.module.scss';

interface Props {
  className?: string;
}

const Dictionary: FunctionComponent<Props> = ({ className }) => {
  const translate = useTranslate();
  const { results, isLoading } = useTypedSelector(selectDictionary);
  const error = useTypedSelector(selectDictionaryError);
  const isFirstAllowed = results.length > 0 ? results[0].isAllowed : undefined;

  return (
    <div
      className={classNames(styles.dictionary, className, {
        [styles.isAllowed]: isFirstAllowed === true,
        [styles.isNotAllowed]: isFirstAllowed === false,
      })}
    >
      {typeof error !== 'undefined' && <EmptyState variant="error">{error.message}</EmptyState>}

      {results.map(({ definitions, exists, isAllowed, word }) => (
        <div
          className={classNames(styles.result, {
            [styles.isAllowed]: isAllowed === true,
            [styles.isNotAllowed]: isAllowed === false,
          })}
          key={word}
        >
          {typeof word === 'undefined' && (
            <EmptyState variant="info">{translate('dictionary.empty-state.uninitialized')}</EmptyState>
          )}

          {typeof word !== 'undefined' && (
            <div className={styles.content}>
              {word && <h2 className={styles.word}>{word}</h2>}

              {isAllowed === false && <div>{translate('dictionary.empty-state.not-allowed')}</div>}

              {isAllowed === true && (
                <>
                  {definitions.length === 0 && (
                    <>
                      {exists && <div>{translate('dictionary.empty-state.no-definitions')}</div>}
                      {!exists && <div>{translate('dictionary.empty-state.no-results')}</div>}
                    </>
                  )}

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

              {!isLoading && isAllowed === null && <div>{translate('dictionary.empty-state.no-results')}</div>}
            </div>
          )}
        </div>
      ))}

      {isLoading && <Loading />}
    </div>
  );
};

export default Dictionary;
