import classNames from 'classnames';
import React, { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { i18nSlice, selectLocale, useTypedSelector } from 'state';
import { Locale } from 'types';

import Radio from '../../../Radio';
import SvgIcon from '../../../SvgIcon';

import styles from './LocaleSetting.module.scss';
import options from './options';

interface Props {
  className?: string;
}

const LocaleSetting: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const locale = useTypedSelector(selectLocale);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newLocale: Locale = event.target.value as Locale;
    dispatch(i18nSlice.actions.changeLocale(newLocale));
  };

  return (
    <div className={classNames(styles.localeSetting, className)}>
      {options.map((option) => (
        <Radio
          checked={locale === option.value}
          className={classNames(styles.option, className, {
            [styles.checked]: locale === option.value,
          })}
          id="locale"
          key={option.value}
          name="locale"
          title={option.label}
          value={option.value}
          onChange={handleChange}
        >
          <div className={styles.label}>
            <SvgIcon className={classNames(styles.flag, option.className)} icon={option.icon} />

            <div>{option.label}</div>
          </div>
        </Radio>
      ))}
    </div>
  );
};

export default LocaleSetting;
