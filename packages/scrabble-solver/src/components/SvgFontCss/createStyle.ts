import createCss from './createCss';

const createStyle = (fontFamily: string) => {
  const style = document.createElement('style');
  style.innerHTML = createCss(fontFamily);
  return style;
};

export default createStyle;
