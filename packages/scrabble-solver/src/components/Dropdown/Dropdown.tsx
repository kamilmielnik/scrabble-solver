import classNames from 'classnames';
import React, { HTMLAttributes, FunctionComponent } from 'react';

import styles from './Dropdown.module.scss';

interface Props extends HTMLAttributes<HTMLUListElement> {
  dropLeft?: boolean;
}

const Dropdown: FunctionComponent<Props> = ({ children, className, dropLeft, ...props }) => (
  <ul
    className={classNames(styles.dropdown, className, {
      [styles.dropLeft]: dropLeft,
    })}
    {...props}
  >
    {children}
  </ul>
);

export default Dropdown;
