const importUrl =
  // eslint-disable-next-line max-len
  'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Open+Sans:wght@400;700&family=Vazirmatn:wght@300;400;700&family=Roboto+Mono&display=swap';

const createCss = (fontFamily: string): string => `@import url('${importUrl}');

text {
  font-family: '${fontFamily}';
}`;

export default createCss;
