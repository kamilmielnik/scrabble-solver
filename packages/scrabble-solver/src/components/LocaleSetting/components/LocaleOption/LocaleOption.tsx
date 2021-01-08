import classNames from 'classnames';
import React, { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { i18nSlice, selectLocale, useTypedSelector } from 'state';
import { Locale } from 'types';

import Radio from '../../../Radio';
import SvgIcon from '../../../SvgIcon';
import { Option } from '../../types';

import styles from './LocaleOption.module.scss';

interface Props {
  className?: string;
  option: Option;
}

const LocaleOption: FunctionComponent<Props> = ({ className, option }) => {
  const dispatch = useDispatch();
  const locale = useTypedSelector(selectLocale);
  const checked = locale === option.value;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newLocale: Locale = event.target.value as Locale;
    dispatch(i18nSlice.actions.changeLocale(newLocale));
  };

  return (
    <Radio
      checked={checked}
      className={classNames(styles.localeOption, className, {
        [styles.checked]: checked,
      })}
      id="locale"
      name="locale"
      title={option.label}
      value={option.value}
      onChange={handleChange}
    >
      <div className={styles.content}>
        <SvgIcon className={classNames(styles.flag, option.className)} icon={option.icon} />

        <div>{option.label}</div>
      </div>
    </Radio>
  );
};

export default LocaleOption;
