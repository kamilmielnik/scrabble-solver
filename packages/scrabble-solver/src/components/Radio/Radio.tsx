import classNames from 'classnames';
import React, { ChangeEventHandler, FunctionComponent, ReactNode } from 'react';

import styles from './Radio.module.scss';

interface Props {
  checked: boolean;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  id: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const Radio: FunctionComponent<Props> = ({ checked, children, className, disabled, id, name, value, onChange }) => (
  <label
    className={classNames(styles.radio, className, {
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
      type="radio"
      value={value}
      onChange={onChange}
    />

    <div className={styles.icon} />

    <div className={styles.content}>{children}</div>
  </label>
);

export default Radio;
