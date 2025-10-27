import classNames from 'classnames';
import {
  type ChangeEventHandler,
  type CSSProperties,
  type FocusEventHandler,
  type FunctionComponent,
  type KeyboardEventHandler,
  memo,
  type MouseEventHandler,
  type Ref,
  type TouchEventHandler,
} from 'react';

import { ExclamationSquareFill } from 'icons';

import styles from './Tile.module.scss';

interface Props {
  'aria-label': string;
  autoFocus?: boolean;
  canShowPoints?: boolean;
  character?: string;
  className?: string;
  disabled?: boolean;
  hintRank?: number;
  highlighted?: boolean;
  inputRef: Ref<HTMLInputElement>;
  isBlank?: boolean;
  isValid?: boolean;
  placeholder?: string;
  points?: number;
  pointsFormatted?: string;
  pointsStyle?: CSSProperties;
  raised?: boolean;
  style?: CSSProperties;
  tabIndex?: number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onMouseDown?: MouseEventHandler<HTMLInputElement>;
  onTouchStart?: TouchEventHandler<HTMLInputElement>;
}

const TilePureBase: FunctionComponent<Props> = ({
  'aria-label': ariaLabel,
  autoFocus,
  canShowPoints,
  character,
  className,
  disabled,
  hintRank,
  highlighted,
  inputRef,
  isBlank,
  isValid,
  placeholder,
  points,
  pointsFormatted,
  pointsStyle,
  raised,
  style,
  tabIndex,
  onChange,
  onFocus,
  onKeyDown,
  onMouseDown,
  onTouchStart,
}) => (
  <div
    className={classNames(styles.tile, className, {
      [styles.blank]: isBlank,
      [styles.empty]: !character,
      [styles.invalid]: !isValid,
      [styles.highlighted]: highlighted,
      [styles.points1]: points === 1,
      [styles.points2]: points === 2,
      [styles.points3]: points === 3,
      [styles.points4]: points === 4,
      [styles.points5]: typeof points === 'number' && points >= 5,
      [styles.raised]: raised,
    })}
    data-hint-rank={hintRank}
    role={highlighted ? 'mark' : undefined}
    style={style}
  >
    {character || placeholder}

    <input
      aria-label={ariaLabel}
      autoCapitalize="none"
      autoComplete="off"
      autoCorrect="off"
      autoFocus={autoFocus}
      className={styles.input}
      disabled={disabled}
      ref={inputRef}
      spellCheck={false}
      tabIndex={tabIndex}
      value={character || ''}
      onChange={onChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    />

    {canShowPoints && (
      <span className={styles.points} style={pointsStyle}>
        {pointsFormatted}
      </span>
    )}

    {!isValid && <ExclamationSquareFill aria-hidden="true" className={styles.alert} role="img" />}
  </div>
);

export const TilePure = memo(TilePureBase);
