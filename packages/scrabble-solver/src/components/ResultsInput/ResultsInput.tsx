import classNames from 'classnames';
import React, { ChangeEvent, FormEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { resultsSlice, selectDictionary, useTypedSelector } from 'state';

import styles from './ResultsInput.module.scss';

interface Props {
  className?: string;
}

const ResultsInput: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const { input } = useTypedSelector(selectDictionary);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(resultsSlice.actions.changeInput(event.target.value));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(resultsSlice.actions.submit());
  };

  return (
    <form className={classNames(styles.resultsInput, className)} onSubmit={handleSubmit}>
      <input className={styles.input} required type="text" value={input} onChange={handleChange} />
    </form>
  );
};

export default ResultsInput;
