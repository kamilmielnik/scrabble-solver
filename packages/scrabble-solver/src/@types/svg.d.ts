/* eslint-disable */

import { ComponentType, SVGProps } from 'react';

declare global {
  type SvgComponent = ComponentType<SVGProps<SVGElement>>;
}

declare module '*.svg' {
  const svgComponent: SvgComponent;
  export default svgComponent;
}
