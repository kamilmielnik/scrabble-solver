/* eslint-disable */

type BrowserSpriteSymbol = {
  content: string;
  id: string;
  node: SVGSymbolElement;
  viewBox: string;
};

declare module '*.svg' {
  const symbol: BrowserSpriteSymbol;
  export default symbol;
}
