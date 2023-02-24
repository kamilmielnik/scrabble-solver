import { EMPTY_CELL } from '@scrabble-solver/constants';
import mergeRefs from 'merge-refs';
import {
  ChangeEventHandler,
  FocusEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
  RefObject,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { getTileSizes, noop } from 'lib';
import { selectLocale, useTypedSelector } from 'state';

import TilePure from './TilePure';

interface Props {
  'aria-label': string;
  autoFocus?: boolean;
  character?: string;
  className?: string;
  disabled?: boolean;
  highlighted?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
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
  'aria-label': ariaLabel,
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
  const characterStyle = useMemo(() => ({ fontSize: tileFontSize }), [tileFontSize]);
  const pointsStyle = useMemo(() => ({ fontSize: pointsFontSize }), [pointsFontSize]);
  const ref = useRef<HTMLInputElement>(null);
  const mergedRef = inputRef ? mergeRefs(ref, inputRef) : ref;
  const isEmpty = !character || character === EMPTY_CELL;
  const canShowPoints = (isBlank || !isEmpty) && typeof points !== 'undefined';
  const pointsFormatted = typeof points === 'number' ? points.toLocaleString(locale) : '';

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    ref.current?.select();
    onKeyDown(event);
  };

  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.focus();
    }
  }, [autoFocus, ref]);

  return (
    <TilePure
      aria-label={ariaLabel}
      autoFocus={autoFocus}
      canShowPoints={canShowPoints}
      character={character}
      characterStyle={characterStyle}
      className={className}
      disabled={disabled}
      highlighted={highlighted}
      inputRef={inputRef}
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
