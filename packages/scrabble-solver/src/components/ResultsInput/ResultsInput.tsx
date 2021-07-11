import classNames from 'classnames';
import React, { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { resultsSlice, selectResultsQuery, useTypedSelector } from 'state';

import styles from './ResultsInput.module.scss';

interface Props {
  className?: string;
}

const ResultsInput: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const value = useTypedSelector(selectResultsQuery);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(resultsSlice.actions.changeQuery(event.target.value));
  };

  return (
    <form className={classNames(styles.resultsInput, className)}>
      <input className={styles.input} type="text" value={value} onChange={handleChange} />
    </form>
  );
};

export default ResultsInput;
