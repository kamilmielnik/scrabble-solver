/**
 * This component is unused, but it serves as a blueprint for the Logo.svg.
 * Logo.svg is what this component generates with all the text nodes transformed
 * into paths (manually with Inkscape), and corner radius removed from tiles.
 */
import { CSSProperties, FunctionComponent } from 'react';

import PlainTiles from '../PlainTiles';

interface Props {
  className?: string;
  style?: CSSProperties;
}

const CONTENT = [['SCRABBLE'], ['SOLVER', '2']];

const LogoBlueprint: FunctionComponent<Props> = ({ className, style }) => (
  <PlainTiles className={className} content={CONTENT} style={style} />
);

export default LogoBlueprint;
