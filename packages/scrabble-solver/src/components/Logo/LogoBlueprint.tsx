/**
 * This component is unused, but it serves as a blueprint for the Logo.svg.
 * Logo.svg is what this component generates with all text nodes:
 * - using font-family: Open Sans
 * - transformed into paths (manually with Inkscape)
 * - arranged (centered vertically against respective rows)
 */
import { type CSSProperties, type FunctionComponent } from 'react';

import { PlainTiles } from '../PlainTiles';

interface Props {
  className?: string;
  style?: CSSProperties;
}

const CONTENT = [['SCRABBLE'], ['SOLVER', '2']];

export const LogoBlueprint: FunctionComponent<Props> = ({ className, style }) => (
  <PlainTiles className={className} content={CONTENT} style={style} />
);
