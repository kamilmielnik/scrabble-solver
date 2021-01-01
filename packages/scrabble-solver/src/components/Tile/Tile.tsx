import { EMPTY_CELL } from '@scrabble-solver/constants';
import classNames from 'classnames';
import React, { FocusEventHandler, forwardRef, KeyboardEventHandler } from 'react';

import { selectConfig, useTypedSelector } from 'state';

import styles from './Tile.module.scss';

interface Props {
  className?: string;
  character?: string;
  highlighted?: boolean;
  isBlank?: boolean;
  placeholder?: string;
  raised?: boolean;
  size: number;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

const Tile = forwardRef<HTMLInputElement, Props>(
  ({ className, character = '', highlighted, isBlank, placeholder, raised, size, onFocus, onKeyDown }, ref) => {
    const config = useTypedSelector(selectConfig);
    const points = config.getCharacterPoints(character);
    const isEmpty = !character || character === EMPTY_CELL;
    const { pointsFontSize, tileFontSize, tileSize } = getSizes(size);

    return (
      <div
        className={classNames(styles.tile, className, {
          [styles.highlighted]: highlighted,
          [styles.blank]: isBlank,
          [styles.raised]: raised,
          [styles.points1]: points === 1,
          [styles.points2]: points === 2,
          [styles.points3]: points === 3,
          [styles.points4]: points === 4,
          [styles.points5]: points >= 5,
        })}
        style={{
          height: tileSize,
          width: tileSize,
        }}
      >
        <input
          className={styles.character}
          maxLength={1}
          placeholder={placeholder}
          ref={ref}
          style={{
            fontSize: tileFontSize,
          }}
          value={character || ''}
          onChange={(event) => event.preventDefault()}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
        />

        {!isBlank && !isEmpty && (
          <span
            className={styles.points}
            style={{
              fontSize: pointsFontSize,
            }}
          >
            {points}
          </span>
        )}
      </div>
    );
  },
);

const MIN_FONT_SIZE = 14;
const MIN_POINTS_FONT_SIZE = 10;

// TODO: put this function in a better place
const getSizes = (tileSize: number) => {
  // TODO: make it better, unhardcode

  return {
    pointsFontSize: Math.max(Math.round(tileSize * 0.25), MIN_POINTS_FONT_SIZE),
    tileFontSize: Math.max(Math.round(tileSize * 0.6), MIN_FONT_SIZE),
    tileSize,
  };
};

export default Object.assign(Tile, {
  getSizes,
});
