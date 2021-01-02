import React, { FunctionComponent } from 'react';

interface Props {
  character: string;
  color: string;
  points?: number;
  size: number;
  x: number;
  y: number;
}

const Tile: FunctionComponent<TileProps> = ({ character, color, points, size, x, y }) => (
  <g>
    <rect fill={color} height={size} width={size} x={x} y={y} />

    <text
      dominantBaseline="central"
      fontFamily="Open Sans"
      fontSize={0.6 * size}
      fontWeight="bold"
      textAnchor="middle"
      x={x + size / 2}
      y={y + size / 2}
    >
      {character}
    </text>

    {typeof points === 'number' && (
      <text
        dominantBaseline="text-after-edge"
        fontFamily="Open Sans"
        fontSize={0.25 * size}
        fontWeight="bold"
        textAnchor="end"
        x={x + size * 0.9}
        y={y + size * 0.95}
      >
        {points}
      </text>
    )}
  </g>
);

export default Tile;
