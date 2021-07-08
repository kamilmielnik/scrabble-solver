import classNames from 'classnames';
import React, { ButtonHTMLAttributes, FunctionComponent, MouseEventHandler } from 'react';

import Content from './Content';
import Link from './Link';
import styles from './SquareButton.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  Icon: SvgComponent;
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const SquareButton: FunctionComponent<Props> = ({ children, className, Icon, ...props }) => (
  <button className={classNames(styles.squareButton, className)} type="button" {...props}>
    <Content Icon={Icon}>{children}</Content>
  </button>
);

export default Object.assign(SquareButton, {
  Link,
});
