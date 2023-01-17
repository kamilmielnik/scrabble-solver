import createStyle from './createStyle';

const createSvg = (fontFamily: string) => {
  const svg = document.createElement('svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.appendChild(createStyle(fontFamily));
  return svg;
};

export default createSvg;
