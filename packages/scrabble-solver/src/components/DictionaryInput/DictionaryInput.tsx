import classNames from 'classnames';
import { ChangeEvent, FormEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { LOCALE_FEATURES } from 'i18n';
import { dictionarySlice, selectDictionary, selectLocale, useTranslate, useTypedSelector } from 'state';

import styles from './DictionaryInput.module.scss';

interface Props {
  className?: string;
}

export const DictionaryInput: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const locale = useTypedSelector(selectLocale);
  const { input } = useTypedSelector(selectDictionary);
  const { comma } = LOCALE_FEATURES[locale];

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
        pattern={`.*[^\\s${comma}].*`}
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
