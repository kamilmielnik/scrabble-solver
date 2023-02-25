import { Locale } from '@scrabble-solver/types';
import classNames from 'classnames';
import { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { Radio } from 'components';
import { selectLocale, settingsSlice, useTypedSelector } from 'state';

import styles from './LocaleSetting.module.scss';
import options from './options';

interface Props {
  className?: string;
  disabled: boolean;
}

const LocaleSetting: FunctionComponent<Props> = ({ className, disabled }) => {
  const dispatch = useDispatch();
  const locale = useTypedSelector(selectLocale);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newLocale: Locale = event.target.value as Locale;
    dispatch(settingsSlice.actions.changeLocale(newLocale));
  };

  return (
    <div className={className}>
      {options.map(({ Icon, ...option }) => (
        <Radio
          checked={locale === option.value}
          className={classNames(styles.option, className, {
            [styles.checked]: locale === option.value,
          })}
          disabled={disabled}
          key={option.value}
          name="locale"
          value={option.value}
          onChange={handleChange}
        >
          <span className={classNames(styles.label, option.className)}>
            <Icon className={classNames(styles.flag, option.className)} />

            <span>{option.label}</span>
          </span>
        </Radio>
      ))}
    </div>
  );
};

export default LocaleSetting;
