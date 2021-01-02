import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import Prototype from './Prototype';
import Tile from './Tile';

const SIZE = 80;
const MARGIN = 5;

const COLOR_YELLOW = '#efe3ae';
const COLOR_GREEN = '#bae3ba';
const COLOR_BLUE = '#c7d8f9';
const COLOR_RED = '#f7c2aa';

const POINTS = {
  A: 1,
  B: 3,
  C: 3,
  E: 1,
  L: 2,
  O: 1,
  R: 1,
  S: 1,
  V: 4,
};

const POINTS_COLORS = {
  1: COLOR_YELLOW,
  2: COLOR_GREEN,
  3: COLOR_BLUE,
  4: COLOR_RED,
};

interface Props {
  className?: string;
}

const Logo: FunctionComponent<Props> = ({ className }) => (
  <>
    <Prototype className={className} />

    <svg className={className} preserveAspectRatio="xMidYMid" viewBox="0 0 1000 200" xmlns="http://www.w3.org/2000/svg">
      {'SCRABBLE'.split('').map((character, index) => (
        <Tile
          character={character}
          color={POINTS_COLORS[POINTS[character]]}
          key={index}
          points={POINTS[character]}
          size={SIZE}
          x={index * (SIZE + MARGIN)}
          y={0}
        />
      ))}

      {'SOLVER'.split('').map((character, index) => (
        <Tile
          character={character}
          color={POINTS_COLORS[POINTS[character]]}
          key={index}
          points={POINTS[character]}
          size={SIZE}
          x={index * (SIZE + MARGIN)}
          y={SIZE + MARGIN}
        />
      ))}
    </svg>
  </>
);

export default Logo;
