import React from 'react';
import classNames from 'classnames';

import { FlagGb, FlagPl, FlagUs } from 'icons';

import { useChangeLocale, useLocale } from './hooks';
import styles from './LocaleSetting.module.scss';

const options = [
  { Component: FlagPl, value: 'pl-PL' },
  { Component: FlagGb, value: 'en-GB' },
  { Component: FlagUs, value: 'en-US' },
];

const LocaleSetting = () => {
  const changeLocale = useChangeLocale();
  const locale = useLocale();

  return (
    <div className={styles.localeSetting} id="locale-setting">
      {options.map(({ Component, value }) => (
        <Component
          key={value}
          className={classNames(styles.option, {
            [styles.selected]: value === locale,
          })}
          title={value}
          onClick={() => changeLocale(value)}
        />
      ))}
    </div>
  );
};

export default LocaleSetting;
