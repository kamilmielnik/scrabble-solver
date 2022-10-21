import { FunctionComponent } from 'react';

// eslint-disable-next-line max-len
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Open+Sans:wght@400;700&family=Roboto+Mono&display=swap');

text {
  font-family: 'Open Sans';
}`;

// eslint-disable-next-line react/no-danger
const SvgFontCss: FunctionComponent = () => <style type="text/css" dangerouslySetInnerHTML={{ __html: CSS }} />;

export default SvgFontCss;
