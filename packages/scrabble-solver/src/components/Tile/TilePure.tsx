import classNames from 'classnames';
import { CSSProperties, forwardRef, HTMLProps, memo } from 'react';

import { ExclamationSquareFill } from 'icons';

import styles from './Tile.module.scss';

export interface Props extends HTMLProps<HTMLDivElement> {
  canShowPoints?: boolean;
  character?: string;
  characterStyle?: CSSProperties;
  className?: string;
  highlighted?: boolean;
  isBlank?: boolean;
  isValid?: boolean;
  placeholder?: string;
  points?: number;
  pointsFormatted?: string;
  pointsStyle?: CSSProperties;
  raised?: boolean;
}

const TilePure = forwardRef<HTMLDivElement, Props>(
  (
    {
      canShowPoints,
      character,
      characterStyle,
      className,
      highlighted,
      isBlank,
      isValid,
      placeholder,
      points,
      pointsFormatted,
      pointsStyle,
      raised,
      ...props
    },
    ref,
  ) => (
    <div
      {...props}
      className={classNames(styles.tile, className, {
        [styles.blank]: isBlank,
        [styles.empty]: !character,
        [styles.highlighted]: highlighted,
        [styles.raised]: raised,
        [styles.points1]: points === 1,
        [styles.points2]: points === 2,
        [styles.points3]: points === 3,
        [styles.points4]: points === 4,
        [styles.points5]: typeof points === 'number' && points >= 5,
      })}
      ref={ref}
    >
      {placeholder && (
        <div className={styles.placeholder} role="presentation" style={characterStyle} tabIndex={-1}>
          {placeholder}
        </div>
      )}

      <div className={styles.character} style={characterStyle} tabIndex={-1}>
        {character}
      </div>

      {canShowPoints && (
        <span className={styles.points} style={pointsStyle}>
          {pointsFormatted}
        </span>
      )}

      {!isValid && <ExclamationSquareFill className={styles.alert} role="alert" />}
    </div>
  ),
);

export default memo(TilePure);
