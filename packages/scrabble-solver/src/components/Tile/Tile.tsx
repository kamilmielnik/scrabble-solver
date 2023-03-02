import { useMergeRefs } from '@floating-ui/react';
import { EMPTY_CELL } from '@scrabble-solver/constants';
import { forwardRef, useEffect, useMemo, useRef } from 'react';

import { useAppLayout } from 'hooks';
import { getTileSizes } from 'lib';
import { EASE_OUT_CUBIC, TILE_APPEAR_DURATION, TILE_APPEAR_KEYFRAMES } from 'parameters';
import { selectLocale, useTypedSelector } from 'state';

import TilePure, { Props as TilePureProps } from './TilePure';

interface Props extends TilePureProps {
  character?: string;
  className?: string;
  disabled?: boolean;
  highlighted?: boolean;
  isBlank?: boolean;
  isValid?: boolean;
  placeholder?: string;
  points?: number;
  raised?: boolean;
  size: number;
}

const Tile = forwardRef<HTMLDivElement, Props>(
  (
    { className, character = '', disabled, highlighted, isBlank, isValid, placeholder, points, raised, size, ...props },
    ref,
  ) => {
    const locale = useTypedSelector(selectLocale);
    const { animateTile, showTilePoints } = useAppLayout();
    const { pointsFontSize, tileFontSize, tileSize } = getTileSizes(size);
    const style = useMemo(() => ({ height: tileSize, width: tileSize }), [tileSize]);
    const characterStyle = useMemo(() => ({ fontSize: tileFontSize }), [tileFontSize]);
    const pointsStyle = useMemo(() => ({ fontSize: pointsFontSize }), [pointsFontSize]);
    const isEmpty = !character || character === EMPTY_CELL;
    const canShowPoints = showTilePoints && (!isEmpty || isBlank) && typeof points !== 'undefined';
    const pointsFormatted = typeof points === 'number' ? points.toLocaleString(locale) : '';
    const tileRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(ref ? [tileRef, ref] : [tileRef]);

    useEffect(() => {
      if (!tileRef.current || !character || !animateTile) {
        return;
      }

      tileRef.current.animate(TILE_APPEAR_KEYFRAMES, {
        duration: TILE_APPEAR_DURATION,
        easing: EASE_OUT_CUBIC,
        fill: 'forwards',
      });
    }, [animateTile, character, tileRef]);

    return (
      <TilePure
        {...props}
        canShowPoints={canShowPoints}
        character={character}
        characterStyle={characterStyle}
        className={className}
        disabled={disabled}
        highlighted={highlighted}
        isBlank={isBlank}
        isValid={isValid}
        placeholder={placeholder}
        points={points}
        pointsFormatted={pointsFormatted}
        pointsStyle={pointsStyle}
        raised={raised}
        ref={mergedRef}
        style={style}
      />
    );
  },
);

export default Tile;
