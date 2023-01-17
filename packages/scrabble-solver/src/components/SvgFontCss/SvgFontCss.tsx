import { FunctionComponent } from 'react';

import createCss from './createCss';

interface Props {
  fontFamily: string;
}

const SvgFontCss: FunctionComponent<Props> = ({ fontFamily }) => {
  // eslint-disable-next-line react/no-danger
  return <style type="text/css" dangerouslySetInnerHTML={{ __html: createCss(fontFamily) }} />;
};

export default SvgFontCss;
