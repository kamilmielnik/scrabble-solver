import classNames from 'classnames';
import React, { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { resultsSlice, selectResultsQuery, useTranslate, useTypedSelector } from 'state';

import styles from './ResultsInput.module.scss';

interface Props {
  className?: string;
}

const ResultsInput: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const value = useTypedSelector(selectResultsQuery);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(resultsSlice.actions.changeQuery(event.target.value));
  };

  return (
    <form className={classNames(styles.resultsInput, className)}>
      <input
        className={styles.input}
        placeholder={translate('results.input.placeholder')}
        type="text"
        value={value}
        onChange={handleChange}
      />
    </form>
  );
};

export default ResultsInput;
