import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { cross } from 'icons';
import { i18nSlice, selectLocale, useTypedSelector } from 'state';
import { Locale } from 'types';

import Screen from '../Screen';

import styles from './Settings.module.scss';

interface Props {
  className?: string;
  hidden?: boolean;
  onClose: () => void;
}

const Settings: FunctionComponent<Props> = ({ className, hidden, onClose }) => {
  const dispatch = useDispatch();
  const locale = useTypedSelector(selectLocale);

  const handleLocaleChange = (newLocale: Locale) => {
    dispatch(i18nSlice.actions.changeLocale(newLocale));
  };

  return (
    <Screen className={classNames(styles.settings, className)} hidden={hidden} onClose={onClose}>
      <div className={styles.content}>Settings</div>
    </Screen>
  );
};

export default Settings;
