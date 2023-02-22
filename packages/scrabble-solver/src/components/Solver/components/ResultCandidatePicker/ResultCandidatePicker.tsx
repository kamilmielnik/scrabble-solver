import classNames from 'classnames';
import { FunctionComponent, HTMLProps } from 'react';
import { useDispatch } from 'react-redux';

import { ChevronDown, ChevronLeft, ChevronRight } from 'icons';
import {
  resultsSlice,
  selectAreResultsOutdated,
  selectLocale,
  selectResultCandidate,
  selectSortedResults,
  useTypedSelector,
} from 'state';

import Button from '../../../Button';
import ApplyButton from '../ApplyButton';

import styles from './ResultCandidatePicker.module.scss';

const ResultCandidatePicker: FunctionComponent<HTMLProps<HTMLDivElement>> = ({ className, ...props }) => {
  const dispatch = useDispatch();
  const locale = useTypedSelector(selectLocale);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const sortedResults = useTypedSelector(selectSortedResults);
  const results = sortedResults || [];
  const resultCandidate = useTypedSelector(selectResultCandidate);

  if (!resultCandidate) {
    return null;
  }

  const index = results.findIndex((result) => result.id === resultCandidate.id);
  const isPreviousDisabled = index <= 0;
  const isNextDisabled = index >= results.length - 1;

  const handleNextClick = () => {
    if (!isNextDisabled) {
      const nextResult = results[index + 1];
      dispatch(resultsSlice.actions.changeResultCandidate(nextResult));
    }
  };

  const handlePreviousClick = () => {
    if (!isPreviousDisabled) {
      const previousResult = results[index - 1];
      dispatch(resultsSlice.actions.changeResultCandidate(previousResult));
    }
  };

  return (
    <div className={classNames(styles.resultCandidatePicker, className)} {...props}>
      <div className={styles.buttons}>
        <Button
          className={styles.button}
          disabled={isPreviousDisabled}
          Icon={ChevronLeft}
          onClick={handlePreviousClick}
        />
        <Button className={styles.button} disabled={isNextDisabled} Icon={ChevronRight} onClick={handleNextClick} />
      </div>

      <button className={styles.resultCandidate} disabled={isOutdated} type="button">
        <div className={styles.points}>{resultCandidate.points.toLocaleString(locale)}</div>
        <div className={styles.word}>{resultCandidate.word}</div>
        <div className={styles.iconContainer}>
          <ChevronDown className={styles.icon} />
        </div>
      </button>

      <ApplyButton className={styles.apply} />
    </div>
  );
};

export default ResultCandidatePicker;
