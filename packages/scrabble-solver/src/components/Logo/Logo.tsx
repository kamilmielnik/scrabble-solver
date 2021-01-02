import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import { COLOR_GREEN, TILE_MARGIN, TILE_SIZE, VERSION_TILE_COLOR, VERSION_TILE_SIZE } from './constants';
import { createTiles, getLongestWord, getViewbox, getX, getY } from './lib';
import Tile from './Tile';

interface Props {
  className?: string;
  name: string;
  version: string;
}

const Logo: FunctionComponent<Props> = ({ className, name = 'SCRABBLE SOLVER', version = '2' }) => (
  <svg className={className} viewBox={getViewbox(name)} xmlns="http://www.w3.org/2000/svg">
    {createTiles(name).map((tile, index) => (
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

    <Tile
      character={version}
      color={VERSION_TILE_COLOR}
      size={VERSION_TILE_SIZE}
      x={getX(getLongestWord(name.split(' ')).length - 1)}
      y={getY(1)}
    />
  </svg>
);

export default Logo;
