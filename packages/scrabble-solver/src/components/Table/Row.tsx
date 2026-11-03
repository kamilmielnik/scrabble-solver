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
  inactive: boolean;
  style?: CSSProperties;
  onBlur?: FocusEventHandler;
  onClick?: MouseEventHandler;
  onFocus?: FocusEventHandler;
  onMouseMove?: MouseEventHandler;
}

export const Row: FunctionComponent<Props> = ({
  'aria-label': ariaLabel,
  children,
  className,
  'data-testid': dataTestId,
  highlighted,
  inactive,
  style,
  onBlur,
  onClick,
  onFocus,
  onMouseMove,
}) => {
  return (
    <button
      aria-current={highlighted ? 'true' : undefined}
      aria-hidden={inactive ? 'true' : undefined}
      aria-label={ariaLabel}
      className={classNames(styles.row, className, {
        [styles.clickable]: Boolean(onClick),
        [styles.highlighted]: highlighted,
      })}
      data-testid={dataTestId}
      style={style && withoutTransform(style)}
      type="button"
      onBlur={onBlur}
      onClick={onClick}
      onFocus={onFocus}
      onMouseMove={onMouseMove}
    >
      <span className={styles.rowContent}>{children}</span>
    </button>
  );
};

/**
 * react-window moves rows with `transform`, which anchor positioning ignores in Firefox and Safari, so the focus ring
 * would stay where the first row is. A margin moves the row in layout instead.
 */
function withoutTransform(style: CSSProperties): CSSProperties {
  const offset = /^translateY\((?<offset>[^)]+)\)$/.exec(String(style.transform))?.groups?.offset;

  return offset ? { ...style, marginTop: offset, transform: undefined } : style;
}
