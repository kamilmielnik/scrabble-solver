import classNames from 'classnames';
import { FunctionComponent, HTMLProps, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ChevronDown } from 'icons';
import {
  resultsSlice,
  selectLocale,
  selectResultCandidate,
  selectSortedFilteredResults,
  useTypedSelector,
} from 'state';

import styles from './ResultCandidatePicker.module.scss';

interface Props extends HTMLProps<HTMLButtonElement> {
  className?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

const ResultCandidatePicker: FunctionComponent<Props> = ({ className, ...props }) => {
  const dispatch = useDispatch();
  const locale = useTypedSelector(selectLocale);
  const resultCandidate = useTypedSelector(selectResultCandidate);
  const results = useTypedSelector(selectSortedFilteredResults)!;

  const [bestResult] = results || [];

  useEffect(() => {
    if (bestResult) {
      dispatch(resultsSlice.actions.changeResultCandidate(bestResult));
    }
  }, [bestResult, dispatch]);

  if (!resultCandidate) {
    return null;
  }

  return (
    <button className={classNames(styles.resultCandidatePicker, className)} type="button" {...props}>
      <div className={styles.points}>{resultCandidate.points.toLocaleString(locale)}</div>
      <div className={styles.word}>{resultCandidate.word}</div>
      <div className={styles.iconContainer}>
        <ChevronDown className={styles.icon} />
      </div>
    </button>
  );
};

export default ResultCandidatePicker;
