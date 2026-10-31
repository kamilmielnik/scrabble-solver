import classNames from 'classnames';
import { type CSSProperties, type FunctionComponent, type HTMLProps } from 'react';

import { selectLocale, useTypedSelector } from '@/state';

import styles from './Progress.module.scss';

interface Props extends HTMLProps<HTMLDivElement> {
  max: number;
  value: number;
}

export const Progress: FunctionComponent<Props> = ({ className, max, style, value, ...props }) => {
  const locale = useTypedSelector(selectLocale);
  const progress = max === 0 ? 0 : value / max;
  const percent = Math.round(100 * progress);

  return (
    <div
      {...props}
      aria-valuemax={max}
      aria-valuemin={0}
      aria-valuenow={value}
      aria-valuetext={`${percent.toLocaleString(locale)}%`}
      className={classNames(styles.progress, className)}
      role="progressbar"
      style={{ ...style, '--progress': `${100 * progress}%` } as CSSProperties}
      title={`${percent.toLocaleString(locale)}%`}
    />
  );
};
