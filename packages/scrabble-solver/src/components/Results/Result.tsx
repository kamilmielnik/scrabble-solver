import React, { CSSProperties, ReactElement } from 'react';
import { useDispatch } from 'react-redux';

import { resultsSlice, selectSortedFilteredResults, useTypedSelector } from 'state';

import Cell from './Cell';
import styles from './Results.module.scss';

interface Props {
  index: number;
  style?: CSSProperties;
}

const Result = ({ index, style }: Props): ReactElement => {
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const results = useTypedSelector(selectSortedFilteredResults)!;
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

  const handleFocus = () => {
    dispatch(resultsSlice.actions.changeResultCandidate(result));
  };

  const handleBlur = () => {
    dispatch(resultsSlice.actions.changeResultCandidate(null));
  };

  return (
    <button
      className={styles.result}
      style={style}
      type="button"
      onBlur={handleBlur}
      onClick={handleClick}
      onFocus={handleFocus}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={styles.resultContent}>
        <Cell className={styles.word} translationKey="common.word" value={result.word} />
        <Cell className={styles.stat} translationKey="common.tiles" value={result.numberOfTiles} />
        <Cell className={styles.stat} translationKey="common.consonants" value={result.numberOfConsonants} />
        <Cell className={styles.stat} translationKey="common.vowels" value={result.numberOfVowels} />
        <Cell className={styles.stat} translationKey="common.blanks" value={result.numberOfBlanks} />
        <Cell className={styles.stat} translationKey="common.words" value={result.numberOfWords} />
        <Cell className={styles.points} translationKey="common.points" value={result.points} />
      </span>
    </button>
  );
};

export default Result;
