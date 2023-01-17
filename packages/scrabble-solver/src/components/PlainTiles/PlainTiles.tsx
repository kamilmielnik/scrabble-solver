import classNames from 'classnames';
import { CSSProperties, FunctionComponent, useMemo } from 'react';

import { LOCALE_FEATURES } from 'i18n';
import { selectLocale, useTypedSelector } from 'state';

import SvgFontCss from '../SvgFontCss';

import { createPlainTiles, getViewbox } from './lib';
import styles from './PlainTiles.module.scss';
import Tile from './Tile';

interface Props {
  className?: string;
  color?: string;
  content: string[][];
  dropShadow?: boolean;
  showPoints?: boolean;
  style?: CSSProperties;
  wave?: boolean;
}

const PlainTiles: FunctionComponent<Props> = ({ className, color, content, dropShadow, showPoints, style, wave }) => {
  const locale = useTypedSelector(selectLocale);
  const { fontFamily } = LOCALE_FEATURES[locale];
  const tiles = useMemo(() => createPlainTiles({ color, content, showPoints }), [color, content, showPoints]);

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
      <SvgFontCss fontFamily={fontFamily} />

      {tiles.map((tile, index) => (
        <Tile
          character={tile.character}
          className={styles.tile}
          color={tile.color}
          fontFamily={fontFamily}
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
