import classNames from 'classnames';
import React, { ChangeEvent, FunctionComponent } from 'react';
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

  return (
    <form className={classNames(styles.resultsInput, className)}>
      <input className={styles.input} required type="text" value={input} onChange={handleChange} />
    </form>
  );
};

export default ResultsInput;
