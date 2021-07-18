import classNames from 'classnames';
import React, { ChangeEventHandler, FunctionComponent, ReactNode } from 'react';

import { checkboxChecked, checkboxEmpty } from 'icons';

import SvgIcon from '../SvgIcon';

import styles from './Checkbox.module.scss';

interface Props {
  checked: boolean;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  id: string;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const Checkbox: FunctionComponent<Props> = ({ checked, children, className, disabled, id, name, onChange }) => (
  <label
    className={classNames(styles.checkbox, className, {
      [styles.checked]: checked,
    })}
    htmlFor={id}
  >
    <input
      checked={checked}
      className={styles.input}
      disabled={disabled}
      id={id}
      name={name}
      type="checkbox"
      onChange={onChange}
    />

    <SvgIcon className={styles.icon} icon={checked ? checkboxChecked : checkboxEmpty} />

    <div className={styles.content}>{children}</div>
  </label>
);

export default Checkbox;
