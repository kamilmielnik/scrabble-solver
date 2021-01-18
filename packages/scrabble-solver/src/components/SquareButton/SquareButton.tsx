import classNames from 'classnames';
import React, { ButtonHTMLAttributes, FunctionComponent, MouseEventHandler } from 'react';

import Content from './Content';
import Link from './Link';
import styles from './SquareButton.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: BrowserSpriteSymbol;
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const SquareButton: FunctionComponent<Props> = ({ children, className, icon, ...props }) => (
  <button className={classNames(styles.squareButton, className)} type="button" {...props}>
    <Content icon={icon}>{children}</Content>
  </button>
);

export default Object.assign(SquareButton, {
  Link,
});
