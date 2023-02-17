import classNames from 'classnames';
import { FunctionComponent, HTMLProps } from 'react';

import { ChevronDown } from 'icons';
import { selectLocale, selectResultCandidate, useTypedSelector } from 'state';

import styles from './ResultCandidatePicker.module.scss';

interface Props extends HTMLProps<HTMLButtonElement> {
  className?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

const ResultCandidatePicker: FunctionComponent<Props> = ({ className, ...props }) => {
  const locale = useTypedSelector(selectLocale);
  const resultCandidate = useTypedSelector(selectResultCandidate);

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
