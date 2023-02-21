import classNames from 'classnames';
import { FunctionComponent, HTMLProps } from 'react';

import { ChevronDown } from 'icons';
import { selectAreResultsOutdated, selectLocale, selectResultCandidate, useTypedSelector } from 'state';

import styles from './ResultCandidatePicker.module.scss';

interface Props extends HTMLProps<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset' | undefined;
}

const ResultCandidatePicker: FunctionComponent<Props> = ({ className, ...props }) => {
  const locale = useTypedSelector(selectLocale);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const resultCandidate = useTypedSelector(selectResultCandidate);

  if (!resultCandidate) {
    return null;
  }

  return (
    <button
      className={classNames(styles.resultCandidatePicker, className)}
      disabled={isOutdated}
      type="button"
      {...props}
    >
      <div className={styles.points}>{resultCandidate.points.toLocaleString(locale)}</div>
      <div className={styles.word}>{resultCandidate.word}</div>
      <div className={styles.iconContainer}>
        <ChevronDown className={styles.icon} />
      </div>
    </button>
  );
};

export default ResultCandidatePicker;
