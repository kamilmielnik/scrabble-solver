import classNames from 'classnames';
import React, { FunctionComponent, useMemo } from 'react';
import { useKey } from 'react-use';

import { PlainTiles } from 'components';
import { useTranslation } from 'state';

import LocaleSetting from '../LocaleSetting';
import Screen from '../Screen';

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
  const titleTilesContent = useMemo(() => [[settingsTranslation.toUpperCase()]], [settingsTranslation]);
  const languageTilesContent = useMemo(() => [[languageTranslation.toUpperCase()]], [languageTranslation]);
  const rulesTilesContent = useMemo(() => [[rulesTranslation.toUpperCase()]], [rulesTranslation]);

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
      <div>
        <PlainTiles className={styles.title} content={titleTilesContent} />
      </div>

      <div className={styles.section}>
        <PlainTiles className={styles.heading} content={languageTilesContent} />
        <LocaleSetting />
      </div>

      <div className={styles.section}>
        <PlainTiles className={styles.heading} content={rulesTilesContent} />
        <div>asd</div>
      </div>
    </Screen>
  );
};

export default Settings;
