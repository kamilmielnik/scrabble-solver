import classNames from 'classnames';
import { type ChangeEvent, type FunctionComponent, type SubmitEventHandler, useState } from 'react';

import { isRegExp } from '@/lib/isRegExp';

import styles from './Table.module.scss';

interface Props {
  className?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export const Search: FunctionComponent<Props> = ({ className, placeholder, value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);

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
