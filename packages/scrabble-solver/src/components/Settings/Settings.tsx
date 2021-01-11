import React, { FunctionComponent } from 'react';
import { useKey } from 'react-use';

import { useTranslate } from 'state';

import Sidebar from '../Sidebar';

import { AutoMoveTilesSetting, ConfigSetting, LocaleSetting, OtherSettings } from './components';

interface Props {
  className?: string;
  hidden: boolean;
  onClose: () => void;
}

const Settings: FunctionComponent<Props> = ({ className, hidden, onClose }) => {
  const translate = useTranslate();

  useKey('Escape', onClose, { event: 'keydown' }, [onClose]);

  return (
    <Sidebar className={className} hidden={hidden} title={translate('settings')} onClose={onClose}>
      <Sidebar.Section title={translate('settings.game')}>
        <ConfigSetting disabled={hidden} />
      </Sidebar.Section>

      <Sidebar.Section title={translate('settings.language')}>
        <LocaleSetting disabled={hidden} />
      </Sidebar.Section>

      <Sidebar.Section title={translate('settings.autoMoveTiles')}>
        <AutoMoveTilesSetting disabled={hidden} />
      </Sidebar.Section>

      <Sidebar.Section title={translate('settings.other')}>
        <OtherSettings disabled={hidden} />
      </Sidebar.Section>
    </Sidebar>
  );
};

export default Settings;
