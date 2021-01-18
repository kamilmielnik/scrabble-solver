import classNames from 'classnames';
import React, { AnchorHTMLAttributes, FunctionComponent } from 'react';

import Content from './Content';
import styles from './SquareButton.module.scss';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: BrowserSpriteSymbol;
  href: string;
  title: string;
}

const Link: FunctionComponent<Props> = ({ children, className, icon, ...props }) => (
  <a className={classNames(styles.squareButton, className)} {...props}>
    <Content icon={icon}>{children}</Content>
  </a>
);

export default Link;
