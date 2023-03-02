import classNames from 'classnames';
import { FunctionComponent, HTMLProps, MouseEventHandler } from 'react';
import { useDispatch } from 'react-redux';

import { useAppLayout } from 'hooks';
import { ChevronDown, ChevronLeft, ChevronRight } from 'icons';
import {
  resultsSlice,
  selectAreResultsOutdated,
  selectIsLoading,
  selectLocale,
  selectResultCandidate,
  selectSortedResults,
  useTranslate,
  useTypedSelector,
} from 'state';

import Button from '../../../Button';
import Spinner from '../../../Spinner';
import InsertButton from '../InsertButton';

import styles from './ResultCandidatePicker.module.scss';

interface Props extends HTMLProps<HTMLDivElement> {
  onResultClick: MouseEventHandler<HTMLButtonElement>;
}

const ResultCandidatePicker: FunctionComponent<Props> = ({ className, onResultClick, ...props }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const locale = useTypedSelector(selectLocale);
  const isLoading = useTypedSelector(selectIsLoading);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const sortedResults = useTypedSelector(selectSortedResults);
  const results = sortedResults || [];
  const resultCandidate = useTypedSelector(selectResultCandidate);
  const index = resultCandidate ? results.findIndex((result) => result.id === resultCandidate.id) : -1;
  const disabled = isOutdated || !resultCandidate;
  const isPreviousDisabled = index <= 0 || disabled;
  const isNextDisabled = index >= results.length - 1 || disabled;
  const bothEnabled = !isPreviousDisabled && !isNextDisabled;
  const { showFloatingSolveButton } = useAppLayout();

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
      <div className={classNames(styles.buttons, { [styles.bothEnabled]: bothEnabled })}>
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
        disabled={disabled}
        type="button"
        onClick={onResultClick}
      >
        {resultCandidate && (
          <>
            <div className={styles.points}>{resultCandidate.points.toLocaleString(locale)}</div>
            <div className={styles.word}>{resultCandidate.word}</div>
          </>
        )}

        {!resultCandidate && <div className={styles.word}> </div>}

        <div className={styles.iconContainer}>
          {showFloatingSolveButton && <ChevronDown className={styles.icon} />}

          {!showFloatingSolveButton && (
            <>
              {isLoading && <Spinner className={styles.loading} />}
              {!isLoading && <ChevronDown className={styles.icon} />}
            </>
          )}
        </div>
      </button>

      <InsertButton className={styles.insert} />
    </div>
  );
};

export default ResultCandidatePicker;
