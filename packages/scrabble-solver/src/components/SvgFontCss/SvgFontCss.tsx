import { FunctionComponent } from 'react';

const SvgFontCss: FunctionComponent = () => (
  <style type="text/css">
    {`@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Open+Sans:wght@400;700&family=Roboto+Mono&display=swap');`}
    {`text {`}
    {`  font-family: 'Open Sans';`}
    {`}`}
  </style>
);

export default SvgFontCss;
