import { useMergeRefs } from '@floating-ui/react';
import { EMPTY_CELL } from '@scrabble-solver/constants';
import {
  ChangeEventHandler,
  FocusEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
  MouseEventHandler,
  Ref,
  TouchEventHandler,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import { useAppLayout } from 'hooks';
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
  inputRef?: Ref<HTMLInputElement | null>;
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
  onMouseDown?: MouseEventHandler<HTMLInputElement>;
  onTouchStart?: TouchEventHandler<HTMLInputElement>;
}

const Tile: FunctionComponent<Props> = ({
  'aria-label': ariaLabel,
  autoFocus,
  className,
  character = '',
  disabled,
  highlighted,
  inputRef,
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
  onMouseDown = noop,
  onTouchStart = noop,
}) => {
  const locale = useTypedSelector(selectLocale);
  const { showTilePoints } = useAppLayout();
  const { pointsFontSize, tileSize } = getTileSizes(size);
  const style = useMemo(() => ({ height: tileSize, width: tileSize }), [tileSize]);
  const pointsStyle = useMemo(() => ({ fontSize: pointsFontSize }), [pointsFontSize]);
  const ref = useRef<HTMLInputElement>(null);
  const mergedRef = useMergeRefs(inputRef ? [ref, inputRef] : [ref]);
  const isEmpty = !character || character === EMPTY_CELL;
  const canShowPoints = showTilePoints && (!isEmpty || isBlank) && typeof points !== 'undefined';
  const pointsFormatted = typeof points === 'number' ? points.toLocaleString(locale) : '';

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      ref.current?.select();
      onKeyDown(event);
    },
    [onKeyDown],
  );

  return (
    <TilePure
      aria-label={ariaLabel}
      autoFocus={autoFocus}
      canShowPoints={canShowPoints}
      character={character}
      className={className}
      disabled={disabled}
      highlighted={highlighted}
      inputRef={mergedRef}
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
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    />
  );
};

export default Tile;
