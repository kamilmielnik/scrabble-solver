import classNames from 'classnames';
import React, { ChangeEventHandler, FunctionComponent, ReactNode } from 'react';

import styles from './Radio.module.scss';

interface Props {
  checked: boolean;
  children?: ReactNode;
  className?: string;
  id: string;
  name: string;
  title: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const Radio: FunctionComponent<Props> = ({ checked, children, className, id, name, title, value, onChange }) => (
  <label
    className={classNames(styles.radio, className, {
      [styles.checked]: checked,
    })}
    htmlFor={id}
    title={title}
  >
    <input
      checked={checked}
      className={styles.input}
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
