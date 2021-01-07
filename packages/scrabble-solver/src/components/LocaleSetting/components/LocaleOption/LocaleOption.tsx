import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
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

  const handleLocaleChange = (newLocale: Locale) => {
    dispatch(i18nSlice.actions.changeLocale(newLocale));
  };

  return (
    <div
      className={classNames(styles.localeOption, className, {
        [styles.selected]: isSelected,
      })}
      onClick={() => handleLocaleChange(option.value)}
    >
      <SvgIcon className={classNames(styles.flag, option.className)} icon={option.icon} />

      <div className={styles.label}>{option.label}</div>
    </div>
  );
};

export default LocaleSetting;
