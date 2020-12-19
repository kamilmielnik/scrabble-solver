import React, { FunctionComponent, SVGAttributes } from 'react';

interface Props extends SVGAttributes<SVGElement> {
  icon: BrowserSpriteSymbol;
}

const SvgIcon: FunctionComponent<Props> = ({ icon, ...props }) => (
  <svg {...props}>
    <use xlinkHref={`#${icon.id}`} />
  </svg>
);

export default SvgIcon;
