import classNames from 'classnames';
import { FunctionComponent, HTMLProps } from 'react';

import { ChevronDown } from 'icons';
import { selectLocale, useTypedSelector } from 'state';

import styles from './ResultCandidatePicker.module.scss';

interface Props extends HTMLProps<HTMLButtonElement> {
  className?: string;
  points: number;
  type?: 'button' | 'submit' | 'reset' | undefined;
  word: string;
}

const ResultCandidatePicker: FunctionComponent<Props> = ({ className, points, word, ...props }) => {
  const locale = useTypedSelector(selectLocale);

  return (
    <button className={classNames(styles.resultCandidatePicker, className)} type="button" {...props}>
      <div className={styles.points}>{points.toLocaleString(locale)}</div>
      <div className={styles.word}>{word}</div>
      <div className={styles.iconContainer}>
        <ChevronDown className={styles.icon} />
      </div>
    </button>
  );
};

export default ResultCandidatePicker;
