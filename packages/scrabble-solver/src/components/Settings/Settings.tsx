import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
import { useKey } from 'react-use';

import { useTranslation } from 'state';

import Sidebar from '../Sidebar';

import { ConfigSetting, LocaleSetting, OtherSettings } from './components';
import styles from './Settings.module.scss';

interface Props {
  className?: string;
  hidden?: boolean;
  onClose: () => void;
}

const Settings: FunctionComponent<Props> = ({ className, hidden, onClose }) => {
  const settingsTranslation = useTranslation('settings');
  const languageTranslation = useTranslation('settings.language');
  const otherTranslation = useTranslation('settings.other');
  const rulesTranslation = useTranslation('settings.rules');

  const handleClose = () => {
    if (!hidden) {
      onClose();
    }
  };

  useKey('Escape', handleClose, { event: 'keydown' }, [hidden, onClose]);

  return (
    <Sidebar
      className={classNames(styles.settings, className)}
      hidden={hidden}
      title={settingsTranslation}
      onClose={onClose}
    >
      <div className={styles.section}>
        <h2 className={styles.heading}>{rulesTranslation}</h2>
        <ConfigSetting disabled={hidden} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>{languageTranslation}</h2>
        <LocaleSetting disabled={hidden} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>{otherTranslation}</h2>
        <OtherSettings disabled={hidden} />
      </div>
    </Sidebar>
  );
};

export default Settings;
