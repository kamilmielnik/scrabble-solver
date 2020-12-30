import { EMPTY_CELL } from '@scrabble-solver/constants';
import classNames from 'classnames';
import React, { FocusEventHandler, forwardRef, KeyboardEventHandler, useImperativeHandle, useRef } from 'react';

import { selectConfig, useTypedSelector } from 'state';

import styles from './Tile.module.scss';

interface Props {
  className?: string;
  character?: string;
  highlighted?: boolean;
  isBlank?: boolean;
  placeholder?: string;
  raised?: boolean;
  small?: boolean;
  size: number;
  onFocus: FocusEventHandler<HTMLInputElement>;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
}

interface TileRef {
  focus: () => void;
}

const Tile = forwardRef<TileRef, Props>(
  ({ className, character = '', highlighted, isBlank, placeholder, raised, small, size, onFocus, onKeyDown }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const config = useTypedSelector(selectConfig);
    const points = config.getCharacterPoints(character);
    const isEmpty = !character || character === EMPTY_CELL;
    const { pointsFontSize, tileFontSize, tileSize } = getSizes(size, small);

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      },
    }));

    return (
      <div
        className={classNames(styles.tile, className, {
          [styles.small]: small,
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
          ref={inputRef}
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
const getSizes = (size: number, small?: boolean) => {
  // TODO: make it better, unhardcode
  const tileSize = small ? Math.round(size * 0.75) : size;

  return {
    pointsFontSize: Math.max(Math.round(tileSize * 0.25), MIN_POINTS_FONT_SIZE),
    tileFontSize: Math.max(Math.round(tileSize * 0.6), MIN_FONT_SIZE),
    tileSize,
  };
};

export default Object.assign(Tile, {
  getSizes,
});
