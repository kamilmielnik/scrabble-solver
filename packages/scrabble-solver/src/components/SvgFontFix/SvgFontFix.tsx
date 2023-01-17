import { FunctionComponent } from 'react';

import { LOCALE_FEATURES } from 'i18n';

import SvgFontCss from '../SvgFontCss';

import styles from './SvgFontFix.module.scss';

const SvgFontFix: FunctionComponent = () => {
  const fontFamilies = Array.from(new Set(Object.values(LOCALE_FEATURES).map(({ fontFamily }) => fontFamily)));

  return (
    <svg className={styles.svgFontFix} xmlns="http://www.w3.org/2000/svg">
      {fontFamilies.map((fontFamily) => (
        <SvgFontCss fontFamily={fontFamily} key={fontFamily} />
      ))}
    </svg>
  );
};

export default SvgFontFix;
