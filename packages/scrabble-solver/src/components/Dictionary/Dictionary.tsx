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
  const isLastAllowed = results.length > 0 ? results[results.length - 1].isAllowed : undefined;

  return (
    <div
      className={classNames(styles.dictionary, className, {
        [styles.isAllowed]: isLastAllowed === true,
        [styles.isNotAllowed]: isLastAllowed === false,
      })}
    >
      {typeof error !== 'undefined' && <EmptyState variant="error">{error.message}</EmptyState>}

      {typeof error === 'undefined' && results.length === 0 && (
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
        </div>
      ))}

      {isLoading && <Loading />}
    </div>
  );
};

export default Dictionary;
