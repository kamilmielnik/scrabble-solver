import { FunctionComponent, HTMLProps } from 'react';

import logo from './Logo.svg';

const Logo: FunctionComponent<HTMLProps<HTMLImageElement>> = (props) => <img {...props} src={logo.src} />;

export default Logo;
