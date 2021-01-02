import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import Prototype from './Prototype';
import Tile from './Tile';

const PADDING_X = 0;
const PADDING_Y = 0;
const SIZE = 80;
const MARGIN = 6;
const MAX_SCATTER = 0;
const MAX_ROTATE = 0;

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

const randomize = (value: number, maxChange: number): number => value + maxChange * 2 * (0.5 - Math.random());

const getX = (index: number, rowIndex: number): number =>
  PADDING_X + ((rowIndex === 1 ? 0 : 0) + index) * (SIZE + MARGIN);

const getY = (index: number): number => PADDING_Y + index * (SIZE + MARGIN);

const createRow = (rowIndex: number, text: string) =>
  text.split('').map((character, index) => ({
    character,
    color: POINTS_COLORS[POINTS[character]],
    points: POINTS[character],
    size: SIZE,
    transform: `rotate(${randomize(0, MAX_ROTATE)}, ${getX(index) + SIZE / 2}, ${getY(0) + SIZE / 2})`,
    x: randomize(getX(index, rowIndex), MAX_SCATTER),
    y: randomize(getY(rowIndex), MAX_SCATTER),
  }));

const tiles = [createRow(0, 'SCRABBLE'), createRow(1, 'SOLVER')].flat();

const Logo: FunctionComponent<Props> = ({ className }) => {
  return (
    <>
      <Prototype className={className} />

      <svg className={className} viewBox="0 0 1000 200" xmlns="http://www.w3.org/2000/svg">
        {tiles.map((tile, index) => (
          <Tile
            character={tile.character}
            color={tile.color}
            key={index}
            points={tile.points}
            size={tile.size}
            transform={tile.transform}
            x={tile.x}
            y={tile.y}
          />
        ))}

        <Tile character="2" color={COLOR_GREEN} size={2 * SIZE + MARGIN} x={getX('SCRABBLE'.length)} y={getY(0)} />
      </svg>
    </>
  );
};

export default Logo;
