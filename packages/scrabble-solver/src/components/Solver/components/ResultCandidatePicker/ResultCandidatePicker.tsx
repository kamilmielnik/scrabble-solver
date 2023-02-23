import classNames from 'classnames';
import { FunctionComponent, HTMLProps, MouseEventHandler } from 'react';
import { useDispatch } from 'react-redux';

import { ChevronDown, ChevronLeft, ChevronRight } from 'icons';
import {
  resultsSlice,
  selectAreResultsOutdated,
  selectLocale,
  selectResultCandidate,
  selectSortedResults,
  useTranslate,
  useTypedSelector,
} from 'state';

import Button from '../../../Button';
import ApplyButton from '../ApplyButton';

import styles from './ResultCandidatePicker.module.scss';

interface Props extends HTMLProps<HTMLDivElement> {
  onResultClick: MouseEventHandler<HTMLButtonElement>;
}

const ResultCandidatePicker: FunctionComponent<Props> = ({ className, onResultClick, ...props }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const locale = useTypedSelector(selectLocale);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const sortedResults = useTypedSelector(selectSortedResults);
  const results = sortedResults || [];
  const resultCandidate = useTypedSelector(selectResultCandidate);
  const index = resultCandidate ? results.findIndex((result) => result.id === resultCandidate.id) : -1;
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
          aria-label={translate('common.previous')}
          className={styles.button}
          disabled={isPreviousDisabled}
          Icon={ChevronLeft}
          onClick={handlePreviousClick}
        />

        <Button
          aria-label={translate('common.next')}
          className={styles.button}
          disabled={isNextDisabled}
          Icon={ChevronRight}
          onClick={handleNextClick}
        />
      </div>

      <button
        aria-label={translate('results')}
        className={styles.resultCandidate}
        disabled={isOutdated || !resultCandidate}
        type="button"
        onClick={onResultClick}
      >
        {resultCandidate && (
          <>
            <div className={styles.points}>{resultCandidate.points.toLocaleString(locale)}</div>
            <div className={styles.word}>{resultCandidate.word}</div>
          </>
        )}

        {!resultCandidate && <div className={styles.word}>-</div>}

        <div className={styles.iconContainer}>
          <ChevronDown className={styles.icon} />
        </div>
      </button>

      <ApplyButton className={styles.apply} />
    </div>
  );
};

export default ResultCandidatePicker;
