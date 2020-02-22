import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useConfig } from 'config';

import styles from './Tile.module.scss';

const Tile = forwardRef(
  ({ character, className, highlighted, isBlank, placeholder, raised, small, onFocus, onKeyDown }, ref) => {
    const inputRef = useRef();
    const config = useConfig();
    const points = config.getCharacterPoints(character);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current.focus();
      }
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
          [styles.points5]: points >= 5
        })}
      >
        <input
          className={styles.character}
          maxLength={1}
          placeholder={placeholder}
          ref={inputRef}
          value={character || ''}
          onChange={(event) => event.preventDefault()}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
        />
        {!isBlank && <span className={styles.points}>{points}</span>}
      </div>
    );
  }
);

Tile.propTypes = {
  character: PropTypes.string,
  className: PropTypes.string,
  highlighted: PropTypes.bool,
  isBlank: PropTypes.bool,
  placeholder: PropTypes.string,
  raised: PropTypes.bool,
  small: PropTypes.bool,
  onFocus: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired
};

export default Tile;
