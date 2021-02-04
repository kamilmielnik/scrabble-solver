import classNames from 'classnames';
import React, { CSSProperties, ReactElement } from 'react';
import { useDispatch } from 'react-redux';

import { resultsSlice, selectSortedResults, useTranslate, useTypedSelector } from 'state';

import styles from './Results.module.scss';

interface Props {
  index: number;
  style?: CSSProperties;
}

const Result = ({ index, style }: Props): ReactElement => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const results = useTypedSelector(selectSortedResults)!;
  const result = results[index];

  const handleClick = () => {
    dispatch(resultsSlice.actions.applyResult(result));
  };

  const handleMouseEnter = () => {
    dispatch(resultsSlice.actions.changeResultCandidate(result));
  };

  const handleMouseLeave = () => {
    dispatch(resultsSlice.actions.changeResultCandidate(null));
  };

  return (
    <button
      className={styles.result}
      style={style}
      type="button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={styles.resultContent}>
        <span className={classNames(styles.cell, styles.word)} title={translate('results.header.word')}>
          {result.word}
        </span>

        <span className={classNames(styles.cell, styles.stat)} title={translate('results.header.tiles')}>
          {result.numberOfTiles}
        </span>

        <span className={classNames(styles.cell, styles.stat)} title={translate('results.header.blanks')}>
          {result.numberOfBlanks}
        </span>

        <span className={classNames(styles.cell, styles.stat)} title={translate('results.header.collisions')}>
          {result.numberOfCollisions}
        </span>

        <span className={classNames(styles.cell, styles.points)} title={translate('results.header.points')}>
          {result.points}
        </span>
      </span>
    </button>
  );
};

export default Result;
