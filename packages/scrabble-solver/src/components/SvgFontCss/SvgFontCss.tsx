import { FunctionComponent, useLayoutEffect } from 'react';

import { noop } from 'lib';

import createCss from './createCss';
import createSvg from './createSvg';

let isInitialized = false;

interface Props {
  fontFamily: string;
}

const SvgFontCss: FunctionComponent<Props> = ({ fontFamily }) => {
  useLayoutEffect(() => {
    if (isInitialized) {
      return noop;
    }

    const svg = createSvg(fontFamily);
    // prevent text flickering when re-mounting SVGs
    document.body.appendChild(svg);
    isInitialized = true;

    return () => {
      svg.remove();
      isInitialized = false;
    };
  }, [fontFamily]);

  // eslint-disable-next-line react/no-danger
  return <style type="text/css" dangerouslySetInnerHTML={{ __html: createCss(fontFamily) }} />;
};

export default SvgFontCss;
