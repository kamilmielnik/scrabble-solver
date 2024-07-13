import classNames from 'classnames';
import { ChangeEventHandler, FunctionComponent, ReactNode } from 'react';

import styles from './Radio.module.scss';

interface Props {
  checked: boolean;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  label: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const Radio: FunctionComponent<Props> = ({ checked, children, className, disabled, label, name, value, onChange }) => (
  <label
    aria-label={label}
    className={classNames(styles.radio, className, {
      [styles.checked]: checked,
      [styles.disabled]: disabled,
    })}
  >
    <input
      checked={checked}
      className={styles.input}
      disabled={disabled}
      name={name}
      type="radio"
      value={value}
      onChange={onChange}
    />

    <div className={styles.icon} role="img" />

    <div className={styles.content}>{children}</div>
  </label>
);

export default Radio;
