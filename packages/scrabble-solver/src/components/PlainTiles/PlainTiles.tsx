import React, { CSSProperties, FunctionComponent } from 'react';

import { createTiles, getViewbox } from './lib';
import Tile from './Tile';

interface Props {
  className?: string;
  content: string[][];
  style?: CSSProperties;
}

const PlainTiles: FunctionComponent<Props> = ({ className, content, style }) => (
  <svg className={className} style={style} viewBox={getViewbox(content)} xmlns="http://www.w3.org/2000/svg">
    {createTiles(content).map((tile, index) => (
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
  </svg>
);

export default PlainTiles;
