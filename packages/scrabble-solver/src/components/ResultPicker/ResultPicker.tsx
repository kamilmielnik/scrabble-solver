import classNames from 'classnames';
import { FunctionComponent, HTMLProps, useEffect } from 'react';

import { ChevronDown } from 'icons';
import { resultsSlice, selectResultCandidate, selectSortedFilteredResults, useTypedSelector } from 'state';

import styles from './ResultPicker.module.scss';
import { useDispatch } from 'react-redux';

interface Props extends HTMLProps<HTMLButtonElement> {
  className?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

const ResultPicker: FunctionComponent<Props> = ({ className, ...props }) => {
  const dispatch = useDispatch();
  const resultCandidate = useTypedSelector(selectResultCandidate);
  const [bestResult] = useTypedSelector(selectSortedFilteredResults)!;

  useEffect(() => {
    if (bestResult) {
      dispatch(resultsSlice.actions.changeResultCandidate(bestResult));
    }
  }, [bestResult, dispatch]);

  if (!resultCandidate) {
    return null;
  }

  return (
    <button className={classNames(styles.resultPicker, className)} type="button" {...props}>
      <div className={styles.points}>{resultCandidate.points}</div>
      <div className={styles.word}>{resultCandidate.word}</div>
      <div className={styles.iconContainer}>
        <ChevronDown className={styles.icon} />
      </div>
    </button>
  );
};

export default ResultPicker;
