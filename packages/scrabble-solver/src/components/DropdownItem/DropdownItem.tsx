import classNames from 'classnames';
import React, { HTMLAttributes, FunctionComponent } from 'react';

import styles from './DropdownItem.module.scss';

const DropdownItem: FunctionComponent<HTMLAttributes<HTMLLIElement>> = ({ children, className, ...props }) => (
  <li className={classNames(styles.item, className)} {...props}>
    {children}
  </li>
);

export default DropdownItem;
