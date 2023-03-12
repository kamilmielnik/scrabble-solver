import { FunctionComponent } from 'react';

interface Props {
  character: string;
  className?: string;
  color: string;
  fontFamily: string;
  points?: number;
  size: number;
  transform?: string;
  x: number;
  y: number;
}

const Tile: FunctionComponent<Props> = ({ character, className, color, fontFamily, points, size, transform, x, y }) => (
  <g className={className} transform={transform}>
    <rect fill={color} height={size} rx={size * 0.15} width={size} x={x} y={y} />

    <text
      dominantBaseline="central"
      fontFamily={fontFamily}
      fontSize={size * 0.6}
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
        fontFamily={fontFamily}
        fontSize={size * 0.25}
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
