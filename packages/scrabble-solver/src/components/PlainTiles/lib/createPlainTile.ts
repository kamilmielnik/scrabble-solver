import { literaki } from '@scrabble-solver/configs';

import {
  PLAIN_TILES_COLOR_DEFAULT,
  PLAIN_TILES_POINTS_COLORS,
  PLAIN_TILES_TILE_MAX_SCATTER,
  PLAIN_TILES_TILE_MAX_ROTATE,
  PLAIN_TILES_TILE_SIZE,
} from 'parameters';

import { CreatePlainTileOptions, PlainTile } from '../types';

import getX from './getX';
import getY from './getY';
import randomize from './randomize';

const createPlainTile = ({ cellIndex, character, color, rowIndex, showPoints }: CreatePlainTileOptions): PlainTile => {
  const configPoints = literaki['en-US'].getCharacterPoints(character.toLowerCase());
  const points = showPoints ? configPoints : undefined;
  const defaultColor =
    typeof configPoints === 'number' ? PLAIN_TILES_POINTS_COLORS[configPoints] : PLAIN_TILES_COLOR_DEFAULT;
  const x = getX(cellIndex) + PLAIN_TILES_TILE_SIZE / 2;
  const y = getY(0) + PLAIN_TILES_TILE_SIZE / 2;

  return {
    character,
    color: color || defaultColor,
    points,
    size: PLAIN_TILES_TILE_SIZE,
    transform: `rotate(${randomize(0, PLAIN_TILES_TILE_MAX_ROTATE)}, ${x}, ${y})`,
    x: randomize(getX(cellIndex), PLAIN_TILES_TILE_MAX_SCATTER),
    y: randomize(getY(rowIndex), PLAIN_TILES_TILE_MAX_SCATTER),
  };
};

export default createPlainTile;
