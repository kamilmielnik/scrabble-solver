import classNames from 'classnames';
import React, { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { i18nSlice, selectLocale, useTypedSelector } from 'state';
import { Locale } from 'types';

import SvgIcon from '../../../SvgIcon';
import { Option } from '../../types';

import styles from './LocaleOption.module.scss';

interface Props {
  className?: string;
  option: Option;
}

const LocaleSetting: FunctionComponent<Props> = ({ className, option }) => {
  const dispatch = useDispatch();
  const locale = useTypedSelector(selectLocale);
  const isSelected = locale === option.value;
  const id = '';

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newLocale: Locale = event.target.value as Locale;
    dispatch(i18nSlice.actions.changeLocale(newLocale));
  };

  return (
    <label
      className={classNames(styles.localeOption, className, {
        [styles.selected]: isSelected,
      })}
      htmlFor={id}
    >
      <input
        checked={isSelected}
        className={styles.input}
        id={id}
        name="locale"
        onChange={handleChange}
        type="radio"
        value={option.value}
      />

      <div className={styles.flagContainer}>
        <SvgIcon className={classNames(styles.flag, option.className)} icon={option.icon} />
      </div>

      <div className={styles.label}>{option.label}</div>

      <div className={styles.radio} />
    </label>
  );
};

export default LocaleSetting;
