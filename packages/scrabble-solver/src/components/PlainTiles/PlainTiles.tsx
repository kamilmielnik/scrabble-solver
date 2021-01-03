import React, { CSSProperties, FunctionComponent, useMemo } from 'react';

import { createTiles, getViewbox } from './lib';
import Tile from './Tile';

interface Props {
  className?: string;
  content: string[][];
  floating?: boolean;
  style?: CSSProperties;
}

const PlainTiles: FunctionComponent<Props> = ({ className, content, style }) => {
  const tiles = useMemo(() => createTiles(content), [content]);

  return (
    <svg className={className} style={style} viewBox={getViewbox(content)} xmlns="http://www.w3.org/2000/svg">
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
    </svg>
  );
};

export default PlainTiles;
