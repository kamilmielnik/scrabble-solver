import classNames from 'classnames';
import { type ChangeEventHandler, type FunctionComponent, type ReactNode } from 'react';

import styles from './Radio.module.scss';

interface Props {
  checked: boolean;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const Radio: FunctionComponent<Props> = ({ checked, children, className, disabled, name, value, onChange }) => (
  <label
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

    <div aria-hidden="true" className={styles.icon} role="img">
      <div className={styles.iconContent} />
    </div>

    <div className={styles.content}>{children}</div>
  </label>
);
