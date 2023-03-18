declare module 'icons/*.svg' {
  import { FunctionComponent, SVGAttributes } from 'react';

  const component: FunctionComponent<SVGAttributes<SVGElement>>;

  export default component;
}
