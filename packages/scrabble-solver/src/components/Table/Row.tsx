import classNames from 'classnames';
import {
  type CSSProperties,
  type FocusEventHandler,
  type FunctionComponent,
  type MouseEventHandler,
  type ReactNode,
} from 'react';

import styles from './Table.module.scss';

interface Props {
  'aria-label': string;
  children: ReactNode;
  className?: string;
  'data-testid'?: string;
  highlighted: boolean;
  isMatching: boolean;
  style?: CSSProperties;
  onBlur?: FocusEventHandler;
  onClick?: MouseEventHandler;
  onFocus?: FocusEventHandler;
  onMouseEnter?: MouseEventHandler;
}

export const Row: FunctionComponent<Props> = ({
  'aria-label': ariaLabel,
  children,
  className,
  'data-testid': dataTestId,
  highlighted,
  isMatching,
  style,
  onBlur,
  onClick,
  onFocus,
  onMouseEnter,
}) => {
  return (
    <button
      aria-current={highlighted ? 'true' : undefined}
      aria-hidden={isMatching ? undefined : 'true'}
      aria-label={ariaLabel}
      className={classNames(styles.row, className, { [styles.highlighted]: highlighted })}
      data-testid={dataTestId}
      style={style}
      type="button"
      onBlur={onBlur}
      onClick={onClick}
      onFocus={onFocus}
      onMouseEnter={onMouseEnter}
    >
      <span className={styles.rowContent}>{children}</span>
    </button>
  );
};
