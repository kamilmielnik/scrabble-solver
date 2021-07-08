import classNames from 'classnames';
import React, { AnchorHTMLAttributes, FunctionComponent } from 'react';

import Content from './Content';
import styles from './SquareButton.module.scss';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  Icon: SvgComponent;
  title: string;
}

const Link: FunctionComponent<Props> = ({ children, className, Icon, ...props }) => (
  <a className={classNames(styles.squareButton, className)} {...props}>
    <Content Icon={Icon}>{children}</Content>
  </a>
);

export default Link;
