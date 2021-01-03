import classNames from 'classnames';
import React, { CSSProperties, FunctionComponent, useMemo } from 'react';

import { createTiles, getViewbox } from './lib';
import styles from './PlainTiles.module.scss';
import Tile from './Tile';

interface Props {
  className?: string;
  content: string[][];
  dropShadow?: boolean;
  style?: CSSProperties;
  wave?: boolean;
}

const PlainTiles: FunctionComponent<Props> = ({ className, content, dropShadow, style, wave }) => {
  const tiles = useMemo(() => createTiles(content), [content]);

  return (
    <svg
      className={classNames(className, {
        [styles.dropShadow]: dropShadow,
        [styles.wave]: wave,
      })}
      style={style}
      viewBox={getViewbox(content)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {tiles.map((tile, index) => (
        <Tile
          character={tile.character}
          className={styles.tile}
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
