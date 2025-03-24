import classNames from 'classnames';
import { FunctionComponent, HTMLProps } from 'react';

import { PROGRESS_COLOR_BACKGROUND, PROGRESS_COLOR_VALUE } from 'parameters';
import { selectLocale, useTypedSelector } from 'state';

import styles from './Progress.module.scss';

interface Props extends HTMLProps<HTMLDivElement> {
  max: number;
  min?: number;
  value: number;
}

const getGradient = (progress: number, color: string, background: string) => {
  const percent = 100 * progress;
  return `linear-gradient(90deg, ${color} 0%, ${color} ${percent}%, ${background} ${percent}%, ${background} 100%)`;
};

export const Progress: FunctionComponent<Props> = ({ className, max, min = 0, style, value, ...props }) => {
  const locale = useTypedSelector(selectLocale);
  const progress = value / (max - min);
  const percent = Math.round(100 * progress);

  return (
    <div
      {...props}
      className={classNames(styles.progress, className)}
      style={{
        ...style,
        backgroundImage: getGradient(progress, PROGRESS_COLOR_VALUE, PROGRESS_COLOR_BACKGROUND),
      }}
      title={`${percent.toLocaleString(locale)}%`}
    />
  );
};
