import classNames from 'classnames';
import { ChangeEventHandler, FunctionComponent, ReactNode } from 'react';

import { CheckboxChecked, CheckboxEmpty } from 'icons';

import styles from './Checkbox.module.scss';

interface Props {
  checked: boolean;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const Checkbox: FunctionComponent<Props> = ({ checked, children, className, disabled, name, onChange }) => (
  <label
    className={classNames(styles.checkbox, className, {
      [styles.checked]: checked,
    })}
  >
    <input
      checked={checked}
      className={styles.input}
      disabled={disabled}
      name={name}
      type="checkbox"
      onChange={onChange}
    />

    {checked ? <CheckboxChecked className={styles.icon} /> : <CheckboxEmpty className={styles.icon} />}

    <div className={styles.content}>{children}</div>
  </label>
);

export default Checkbox;
