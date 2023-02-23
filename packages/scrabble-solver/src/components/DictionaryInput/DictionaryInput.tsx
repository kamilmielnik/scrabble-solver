import { COMMA_ARABIC, COMMA_LATIN } from '@scrabble-solver/constants';
import classNames from 'classnames';
import { ChangeEvent, FormEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { dictionarySlice, selectDictionary, useTranslate, useTypedSelector } from 'state';

import styles from './DictionaryInput.module.scss';

interface Props {
  className?: string;
}

const DictionaryInput: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const { input } = useTypedSelector(selectDictionary);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(dictionarySlice.actions.changeInput(event.target.value));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(dictionarySlice.actions.submit());
  };

  return (
    <form className={classNames(styles.dictionaryInput, className)} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        pattern={`.*[^\\s${COMMA_ARABIC}${COMMA_LATIN}].*`}
        placeholder={translate('dictionary.input.placeholder')}
        required
        title={translate('dictionary.input.title')}
        type="text"
        value={input}
        onChange={handleChange}
      />
    </form>
  );
};

export default DictionaryInput;
