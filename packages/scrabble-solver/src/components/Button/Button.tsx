import classNames from 'classnames';
import React, { ButtonHTMLAttributes, FunctionComponent, MouseEventHandler } from 'react';

import styles from './Button.module.scss';
import Content from './Content';
import Link from './Link';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  alwaysShowLabel?: boolean;
  icon: BrowserSpriteSymbol;
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const Button: FunctionComponent<Props> = ({ alwaysShowLabel, children, className, icon, ...props }) => (
  <button
    className={classNames(styles.button, className, {
      [styles.alwaysShowLabel]: alwaysShowLabel,
    })}
    type="button"
    {...props}
  >
    <Content icon={icon}>{children}</Content>
  </button>
);

export default Object.assign(Button, {
  Link,
});
