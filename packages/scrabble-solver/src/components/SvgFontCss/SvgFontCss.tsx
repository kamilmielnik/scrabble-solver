import { FunctionComponent, useLayoutEffect } from 'react';

// eslint-disable-next-line max-len
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Open+Sans:wght@400;700&family=Vazirmatn:wght@300;400;700&family=Roboto+Mono&display=swap');

text {
  font-family: 'Open Sans';
}`;

let isInitialized = false;

const createSvg = () => {
  const svg = document.createElement('svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.appendChild(createStyle());
  return svg;
};

const createStyle = () => {
  const style = document.createElement('style');
  style.innerHTML = CSS;
  return style;
};

const SvgFontCss: FunctionComponent = () => {
  useLayoutEffect(() => {
    if (!isInitialized) {
      // prevent text flickering when re-mounting SVGs
      document.body.appendChild(createSvg());
      isInitialized = true;
    }
  }, []);

  // eslint-disable-next-line react/no-danger
  return <style type="text/css" dangerouslySetInnerHTML={{ __html: CSS }} />;
};

export default SvgFontCss;
