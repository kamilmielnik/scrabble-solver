import { type CSSProperties, type FunctionComponent } from 'react';

const INVISIBLE_STYLE: CSSProperties = {
  color: 'transparent',
  pointerEvents: 'none',
  position: 'absolute',
  userSelect: 'none',
  transform: 'translateY(-9999px)',
};

export const SeoMessage: FunctionComponent = () => (
  <p style={INVISIBLE_STYLE}>
    Scrabble Solver 2 is a free and open-source analysis tool for Scrabble, Scrabble Duel, Super Scrabble, Letter
    League, Crossplay, Literaki, and Kelimelik. Quickly find top scoring words using given letters and board state.
    Available in English, French, German, Persian, Polish, Romanian, Spanish, and Turkish. Source code is available on
    GitHub - contributions are welcome!
  </p>
);
