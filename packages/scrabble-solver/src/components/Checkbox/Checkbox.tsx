import classNames from 'classnames';
import React, { ChangeEventHandler, FunctionComponent, ReactNode } from 'react';

import { CheckboxChecked, CheckboxEmpty } from 'icons';

import styles from './Checkbox.module.scss';

interface Props {
  checked: boolean;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  id: string;
  name: string;
  title: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const Checkbox: FunctionComponent<Props> = ({ checked, children, className, disabled, id, name, title, onChange }) => (
  <label
    className={classNames(styles.checkbox, className, {
      [styles.checked]: checked,
    })}
    htmlFor={id}
    title={title}
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

    {checked && <CheckboxChecked className={styles.icon} />}

    {!checked && <CheckboxEmpty className={styles.icon} />}

    <div className={styles.content}>{children}</div>
  </label>
);

export default Checkbox;
