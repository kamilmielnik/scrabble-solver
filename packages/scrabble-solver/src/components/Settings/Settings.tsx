import React, { FunctionComponent } from 'react';

import { useTranslate } from 'state';

import Sidebar from '../Sidebar';

import { AutoGroupTilesSetting, ConfigSetting, LocaleSetting } from './components';

interface Props {
  className?: string;
  hidden: boolean;
  onClose: () => void;
}

const Settings: FunctionComponent<Props> = ({ className, hidden, onClose }) => {
  const translate = useTranslate();

  const handleClose = () => {
    if (!hidden) {
      onClose();
    }
  };

  return (
    <Sidebar className={className} hidden={hidden} title={translate('settings')} onClose={handleClose}>
      <Sidebar.Section title={translate('settings.game')}>
        <ConfigSetting disabled={hidden} />
      </Sidebar.Section>

      <Sidebar.Section title={translate('settings.language')}>
        <LocaleSetting disabled={hidden} />
      </Sidebar.Section>

      <Sidebar.Section title={translate('settings.autoGroupTiles')}>
        <AutoGroupTilesSetting disabled={hidden} />
      </Sidebar.Section>
    </Sidebar>
  );
};

export default Settings;
