import React, { CSSProperties, FunctionComponent } from 'react';

import PlainTiles from '../PlainTiles';

interface Props {
  className?: string;
  style?: CSSProperties;
}

const CONTENT = [['SCRABBLE'], ['SOLVER', '2']];

const Logo: FunctionComponent<Props> = ({ className, style }) => (
  <PlainTiles className={className} color={''} content={CONTENT} style={style} />
);

export default Logo;
