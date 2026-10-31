import classNames from 'classnames';
import { type ChangeEvent, type FunctionComponent, type SubmitEventHandler, useState } from 'react';

import { isRegExp } from '@/lib/isRegExp';

import styles from './Table.module.scss';

interface Props {
  className?: string;
  placeholder: string;
  resetKey?: unknown;
  value: string;
  onChange: (value: string) => void;
}

export const Search: FunctionComponent<Props> = ({ className, placeholder, resetKey, value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);
  const [synced, setSynced] = useState({ resetKey, value });

  if (value !== synced.value || resetKey !== synced.resetKey) {
    setSynced({ resetKey, value });
    setLocalValue(value);
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setLocalValue(newValue);

    if (isRegExp(newValue)) {
      onChange(newValue);
    }
  };

  const handleSubmit: SubmitEventHandler = (event) => {
    event.preventDefault();
  };

  return (
    <form className={classNames(styles.search, className)} onSubmit={handleSubmit}>
      <input
        className={styles.searchField}
        placeholder={placeholder}
        type="text"
        value={localValue}
        onChange={handleChange}
      />
    </form>
  );
};
