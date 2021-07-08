import classNames from 'classnames';
import React, { AnchorHTMLAttributes, FunctionComponent } from 'react';

import styles from './Button.module.scss';
import Content from './Content';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  Icon: SvgComponent;
  title: string;
}

const Link: FunctionComponent<Props> = ({ children, className, Icon, ...props }) => (
  <a className={classNames(styles.button, className)} {...props}>
    <Content Icon={Icon}>{children}</Content>
  </a>
);

export default Link;
