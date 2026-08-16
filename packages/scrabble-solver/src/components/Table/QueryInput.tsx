import classNames from 'classnames';
import { type ChangeEvent, type FunctionComponent, type SubmitEventHandler, useState } from 'react';

import { isRegExp } from '@/lib/isRegExp';

import styles from './Table.module.scss';

interface Props {
  className?: string;
  placeholder: string;
  query: string;
  onQueryChange: (query: string) => void;
}

export const QueryInput: FunctionComponent<Props> = ({ className, placeholder, query, onQueryChange }) => {
  const [localValue, setLocalValue] = useState(query);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setLocalValue(newValue);

    if (isRegExp(newValue)) {
      onQueryChange(newValue);
    }
  };

  const handleSubmit: SubmitEventHandler = (event) => {
    event.preventDefault();
  };

  return (
    <form className={classNames(styles.queryInput, className)} onSubmit={handleSubmit}>
      <input
        className={styles.queryInputField}
        placeholder={placeholder}
        type="text"
        value={localValue}
        onChange={handleChange}
      />
    </form>
  );
};
