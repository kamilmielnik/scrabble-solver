import { Locale } from '@scrabble-solver/types';
import classNames from 'classnames';
import React, { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { selectLocale, settingsSlice, useTypedSelector } from 'state';

import Radio from '../../../Radio';
import SvgIcon from '../../../SvgIcon';

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
      {options.map((option) => (
        <Radio
          checked={locale === option.value}
          className={classNames(styles.option, className, {
            [styles.checked]: locale === option.value,
          })}
          disabled={disabled}
          id="locale"
          key={option.value}
          name="locale"
          title={`${option.label} (${option.value})`}
          value={option.value}
          onChange={handleChange}
        >
          <span className={styles.label}>
            <SvgIcon className={classNames(styles.flag, option.className)} icon={option.icon} />

            <span>{option.label}</span>
          </span>
        </Radio>
      ))}
    </div>
  );
};

export default LocaleSetting;
