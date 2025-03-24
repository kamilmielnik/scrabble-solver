import { CSSProperties, FunctionComponent } from 'react';

const INVISIBLE_STYLE: CSSProperties = {
  color: 'transparent',
  pointerEvents: 'none',
  position: 'absolute',
  userSelect: 'none',
  transform: 'translateY(-9999px)',
};

export const SeoMessage: FunctionComponent = () => (
  <p style={INVISIBLE_STYLE}>
    Scrabble Solver 2 is a free and open-source analysis tool for Scrabble, Super Scrabble &amp; Literaki. Quickly find
    top scoring words using given letters and board state. Available in English, French, German, Polish & Spanish.
    Source code is available on GitHub - contributions are welcome!
  </p>
);
