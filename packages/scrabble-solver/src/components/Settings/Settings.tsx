import classNames from 'classnames';
import React, { FunctionComponent, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useKey } from 'react-use';

import { PlainTiles } from 'components';
import { i18nSlice, selectLocale, useTranslation, useTypedSelector } from 'state';
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
  const settingsTranslation = useTranslation('settings');
  const titleTilesContent = useMemo(() => [[settingsTranslation.toUpperCase()]], [settingsTranslation]);

  const handleLocaleChange = (newLocale: Locale) => {
    dispatch(i18nSlice.actions.changeLocale(newLocale));
  };

  const handleClose = () => {
    if (!hidden) {
      onClose();
    }
  };

  useKey('Escape', handleClose, { event: 'keydown' }, [hidden, onClose]);

  return (
    <Screen
      className={classNames(styles.settings, className)}
      contentClassName={styles.content}
      hidden={hidden}
      onClose={onClose}
    >
      <PlainTiles className={styles.title} content={titleTilesContent} />
      <div>Hello world</div>
    </Screen>
  );
};

export default Settings;
