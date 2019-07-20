import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { BLANK } from '@scrabble-solver/constants';

import { useConfig } from 'config';

import styles from './Tile.module.scss';

const Tile = forwardRef(({ character, className, isCandidate, placeholder, onFocus, onKeyDown }, ref) => {
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
        [styles.empty]: character === null,
        [styles.candidate]: isCandidate,
        [styles.blank]: character === BLANK,
        [styles.points1]: points === 1,
        [styles.points2]: points === 2,
        [styles.points3]: points === 3,
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
      {points > 0 && <span className={styles.points}>{points}</span>}
    </div>
  );
});

Tile.propTypes = {
  className: PropTypes.string,
  character: PropTypes.string,
  isCandidate: PropTypes.bool,
  placeholder: PropTypes.string,
  onFocus: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired
};

export default Tile;
