import classNames from 'classnames';
import React, {
  ChangeEventHandler,
  CSSProperties,
  FocusEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
  memo,
  RefObject,
} from 'react';

import styles from './Tile.module.scss';

interface Props {
  autoFocus?: boolean;
  canShowPoints?: boolean;
  character?: string;
  className?: string;
  disabled?: boolean;
  highlighted?: boolean;
  inputRef: RefObject<HTMLInputElement>;
  inputStyle?: CSSProperties;
  isBlank?: boolean;
  placeholder?: string;
  points?: number;
  pointsStyle?: CSSProperties;
  raised?: boolean;
  style?: CSSProperties;
  tabIndex?: number;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

const handleChange: ChangeEventHandler = (event) => event.preventDefault();

const TilePure: FunctionComponent<Props> = ({
  autoFocus,
  canShowPoints,
  character,
  className,
  disabled,
  highlighted,
  inputRef,
  inputStyle,
  isBlank,
  placeholder,
  points,
  pointsStyle,
  raised,
  style,
  tabIndex,
  onFocus,
  onKeyDown,
}) => (
  <div
    className={classNames(styles.tile, className, {
      [styles.highlighted]: highlighted,
      [styles.blank]: isBlank,
      [styles.raised]: raised,
      [styles.points1]: points === 1,
      [styles.points2]: points === 2,
      [styles.points3]: points === 3,
      [styles.points4]: points === 4,
      [styles.points5]: typeof points === 'number' && points >= 5,
    })}
    style={style}
  >
    <input
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      autoFocus={autoFocus}
      className={styles.character}
      disabled={disabled}
      maxLength={1}
      placeholder={placeholder}
      ref={inputRef}
      spellCheck={false}
      style={inputStyle}
      tabIndex={tabIndex}
      value={character || ''}
      onChange={handleChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
    />

    {canShowPoints && (
      <span className={styles.points} style={pointsStyle}>
        {points}
      </span>
    )}
  </div>
);

export default memo(TilePure);
