import { EMPTY_CELL } from '@scrabble-solver/constants';
import React, {
  createRef,
  FocusEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
  RefObject,
  useEffect,
  useMemo,
} from 'react';

import { getTileSizes } from 'lib';
import { selectConfig, useTypedSelector } from 'state';

import TileView from './TileView';

interface Props {
  autoFocus?: boolean;
  character?: string;
  className?: string;
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

const Tile: FunctionComponent<Props> = ({
  autoFocus,
  className,
  character = '',
  highlighted,
  inputRef: ref,
  isBlank,
  placeholder,
  raised,
  size,
  onFocus,
  onKeyDown,
}) => {
  const { pointsFontSize, tileFontSize, tileSize } = getTileSizes(size);
  const style = useMemo(() => ({ height: tileSize, width: tileSize }), [tileSize]);
  const inputStyle = useMemo(() => ({ fontSize: tileFontSize }), [tileFontSize]);
  const pointsStyle = useMemo(() => ({ fontSize: pointsFontSize }), [pointsFontSize]);
  const inputRef = useMemo<RefObject<HTMLInputElement>>(() => ref || createRef(), [ref]);
  const config = useTypedSelector(selectConfig);
  const points = isBlank ? config.blankScore : config.getCharacterPoints(character);
  const isEmpty = !character || character === EMPTY_CELL;
  const canShowPoints = (isBlank || !isEmpty) && typeof points !== 'undefined';

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, inputRef]);

  return (
    <TileView
      autoFocus={autoFocus}
      canShowPoints={canShowPoints}
      character={character}
      className={className}
      highlighted={highlighted}
      inputRef={inputRef}
      inputStyle={inputStyle}
      isBlank={isBlank}
      placeholder={placeholder}
      points={points}
      pointsStyle={pointsStyle}
      raised={raised}
      style={style}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
    />
  );
};

export default Tile;
