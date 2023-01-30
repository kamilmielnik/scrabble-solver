import { EMPTY_CELL } from '@scrabble-solver/constants';
import {
  ChangeEventHandler,
  createRef,
  FocusEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
  RefObject,
  useEffect,
  useMemo,
} from 'react';

import { getTileSizes, noop } from 'lib';
import { selectLocale, useTypedSelector } from 'state';

import TilePure from './TilePure';

interface Props {
  autoFocus?: boolean;
  character?: string;
  className?: string;
  disabled?: boolean;
  highlighted?: boolean;
  inputRef?: RefObject<HTMLInputElement>;
  isBlank?: boolean;
  isValid?: boolean;
  placeholder?: string;
  points?: number;
  raised?: boolean;
  size: number;
  tabIndex?: number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

const Tile: FunctionComponent<Props> = ({
  autoFocus,
  className,
  character = '',
  disabled,
  highlighted,
  inputRef: ref,
  isBlank,
  isValid,
  placeholder,
  points,
  raised,
  size,
  tabIndex,
  onChange,
  onFocus = noop,
  onKeyDown = noop,
}) => {
  const locale = useTypedSelector(selectLocale);
  const { pointsFontSize, tileFontSize, tileSize } = getTileSizes(size);
  const style = useMemo(() => ({ height: tileSize, width: tileSize }), [tileSize]);
  const inputStyle = useMemo(() => ({ fontSize: tileFontSize }), [tileFontSize]);
  const pointsStyle = useMemo(() => ({ fontSize: pointsFontSize }), [pointsFontSize]);
  const inputRef = useMemo<RefObject<HTMLInputElement>>(() => ref || createRef(), [ref]);
  const isEmpty = !character || character === EMPTY_CELL;
  const canShowPoints = (isBlank || !isEmpty) && typeof points !== 'undefined';
  const pointsFormatted = typeof points === 'number' ? points.toLocaleString(locale) : '';

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    inputRef.current?.select();
    onKeyDown(event);
  };

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, inputRef]);

  return (
    <TilePure
      autoFocus={autoFocus}
      canShowPoints={canShowPoints}
      character={character}
      className={className}
      disabled={disabled}
      highlighted={highlighted}
      inputRef={inputRef}
      inputStyle={inputStyle}
      isBlank={isBlank}
      isValid={isValid}
      placeholder={placeholder}
      points={points}
      pointsFormatted={pointsFormatted}
      pointsStyle={pointsStyle}
      raised={raised}
      style={style}
      tabIndex={tabIndex}
      onChange={onChange}
      onFocus={onFocus}
      onKeyDown={handleKeyDown}
    />
  );
};

export default Tile;
