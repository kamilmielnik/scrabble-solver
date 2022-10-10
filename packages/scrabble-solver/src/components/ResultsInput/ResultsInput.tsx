import classNames from 'classnames';
import { ChangeEvent, FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';

import { isRegExp } from 'lib';
import { resultsSlice, selectResultsQuery, useTranslate, useTypedSelector } from 'state';

import styles from './ResultsInput.module.scss';

interface Props {
  className?: string;
}

const ResultsInput: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const value = useTypedSelector(selectResultsQuery);
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setLocalValue(newValue);

    if (isRegExp(newValue)) {
      dispatch(resultsSlice.actions.changeQuery(newValue));
    }
  };

  return (
    <form className={classNames(styles.resultsInput, className)}>
      <input
        className={styles.input}
        placeholder={translate('results.input.placeholder')}
        type="text"
        value={localValue}
        onChange={handleChange}
      />
    </form>
  );
};

export default ResultsInput;
