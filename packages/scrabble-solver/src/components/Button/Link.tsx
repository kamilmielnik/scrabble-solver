import classNames from 'classnames';
import React, { AnchorHTMLAttributes, FunctionComponent } from 'react';

import styles from './Button.module.scss';
import Content from './Content';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: BrowserSpriteSymbol;
  href: string;
  title: string;
}

const Link: FunctionComponent<Props> = ({ children, className, icon, ...props }) => (
  <a className={classNames(styles.button, className)} {...props}>
    <Content icon={icon}>{children}</Content>
  </a>
);

export default Link;
