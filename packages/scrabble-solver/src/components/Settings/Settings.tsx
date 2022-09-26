import { FunctionComponent } from 'react';

import { useTranslate } from 'state';

import Sidebar from '../Sidebar';

import { AutoGroupTilesSetting, ConfigSetting, LocaleSetting } from './components';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const Settings: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const translate = useTranslate();

  return (
    <Sidebar className={className} isOpen={isOpen} title={translate('settings')} onClose={onClose}>
      <Sidebar.Section title={translate('settings.game')}>
        <ConfigSetting disabled={!isOpen} />
      </Sidebar.Section>

      <Sidebar.Section title={translate('settings.language')}>
        <LocaleSetting disabled={!isOpen} />
      </Sidebar.Section>

      <Sidebar.Section title={translate('settings.autoGroupTiles')}>
        <AutoGroupTilesSetting disabled={!isOpen} />
      </Sidebar.Section>
    </Sidebar>
  );
};

export default Settings;
