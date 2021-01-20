import { EMPTY_CELL } from '@scrabble-solver/constants';
import classNames from 'classnames';
import React, {
  createRef,
  ChangeEventHandler,
  FocusEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
  RefObject,
  useEffect,
  useMemo,
} from 'react';

import { getTileSizes } from 'lib';
import { selectConfig, useTypedSelector } from 'state';

import styles from './Tile.module.scss';

interface Props {
  autoFocus?: boolean;
  className?: string;
  character?: string;
  highlighted?: boolean;
  inputRef?: RefObject<HTMLInputElement>;
  isBlank?: boolean;
  placeholder?: string;
  raised?: boolean;
  size: number;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

const handleChange: ChangeEventHandler = (event) => event.preventDefault();

const Tile: FunctionComponent<Props> = ({
  autoFocus,
  className,
  character = '',
  highlighted,
  inputRef,
  isBlank,
  placeholder,
  raised,
  size,
  onFocus,
  onKeyDown,
}) => {
  const ref = useMemo<RefObject<HTMLInputElement>>(() => inputRef || createRef(), [inputRef]);
  const config = useTypedSelector(selectConfig);
  const points = isBlank ? config.blankScore : config.getCharacterPoints(character);
  const isEmpty = !character || character === EMPTY_CELL;
  const canShowPoints = (isBlank || !isEmpty) && typeof points !== 'undefined';
  const { pointsFontSize, tileFontSize, tileSize } = getTileSizes(size);
  const style = useMemo(() => ({ height: tileSize, width: tileSize }), [tileSize]);
  const inputStyle = useMemo(() => ({ fontSize: tileFontSize }), [tileFontSize]);
  const pointsStyle = useMemo(() => ({ fontSize: pointsFontSize }), [pointsFontSize]);

  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.focus();
    }
  }, [autoFocus, ref]);

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
        maxLength={1}
        placeholder={placeholder}
        ref={ref}
        spellCheck={false}
        style={inputStyle}
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
};

export default Tile;
