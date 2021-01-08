import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
import { useKey } from 'react-use';

import { useTranslation } from 'state';

import Screen from '../Screen';

import { LocaleSetting, OtherSettings } from './components';
import styles from './Settings.module.scss';

interface Props {
  className?: string;
  hidden?: boolean;
  onClose: () => void;
}

const Settings: FunctionComponent<Props> = ({ className, hidden, onClose }) => {
  const settingsTranslation = useTranslation('settings');
  const languageTranslation = useTranslation('settings.language');
  const rulesTranslation = useTranslation('settings.rules');

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
      <h1 className={styles.title}>{settingsTranslation}</h1>

      <div className={styles.section}>
        <h2 className={styles.heading}>{languageTranslation}</h2>
        <LocaleSetting />
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>{rulesTranslation}</h2>
        <div>asd</div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>{rulesTranslation}</h2>
        <OtherSettings />
      </div>
    </Screen>
  );
};

export default Settings;
