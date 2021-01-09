import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import { selectDictionaryRoot, useTranslate, useTypedSelector } from 'state';

import EmptyState from '../EmptyState';
import Loading from '../Loading';

import styles from './Dictionary.module.scss';

interface Props {
  className?: string;
}

const Dictionary: FunctionComponent<Props> = ({ className }) => {
  const translate = useTranslate();
  const { definitions, isAllowed, isLoading, word } = useTypedSelector(selectDictionaryRoot);

  return (
    <div
      className={classNames(styles.dictionary, className, {
        [styles.isAllowed]: isAllowed === true,
        [styles.isNotAllowed]: isAllowed === false,
      })}
    >
      {typeof word === 'undefined' && (
        <EmptyState type="info">{translate('dictionary.empty-state.unitialized')}</EmptyState>
      )}

      {typeof word !== 'undefined' && (
        <div className={styles.content}>
          {word && <h2 className={styles.word}>{word}</h2>}

          {isAllowed === false && <div>{translate('dictionary.empty-state.not-allowed')}</div>}

          {isAllowed === true && (
            <>
              {definitions.length === 0 && <div>{translate('dictionary.empty-state.no-definitions')}</div>}

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

      {isLoading && <Loading />}
    </div>
  );
};

export default Dictionary;
