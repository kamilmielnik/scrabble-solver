import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
import { useKey } from 'react-use';

import { useTranslate } from 'state';

import Sidebar from '../Sidebar';

import { ConfigSetting, LocaleSetting, OtherSettings } from './components';
import styles from './Settings.module.scss';

interface Props {
  className?: string;
  hidden: boolean;
  onClose: () => void;
}

const Settings: FunctionComponent<Props> = ({ className, hidden, onClose }) => {
  const translate = useTranslate();

  useKey('Escape', onClose, { event: 'keydown' }, [onClose]);

  return (
    <Sidebar
      className={classNames(styles.settings, className)}
      hidden={hidden}
      title={translate('settings')}
      onClose={onClose}
    >
      <div className={styles.section}>
        <h2 className={styles.heading}>{translate('settings.game')}</h2>
        <ConfigSetting disabled={hidden} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>{translate('settings.language')}</h2>
        <LocaleSetting disabled={hidden} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>{translate('settings.other')}</h2>
        <OtherSettings disabled={hidden} />
      </div>
    </Sidebar>
  );
};

export default Settings;
