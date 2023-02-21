import { FunctionComponent } from 'react';

import { Modal } from 'components';
import { useTranslate } from 'state';

import { AutoGroupTilesSetting, ConfigSetting, LocaleSetting } from './components';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const translate = useTranslate();

  return (
    <Modal className={className} isOpen={isOpen} title={translate('settings')} onClose={onClose}>
      <Modal.Section title={translate('settings.game')}>
        <ConfigSetting disabled={!isOpen} />
      </Modal.Section>

      <Modal.Section title={translate('settings.language')}>
        <LocaleSetting disabled={!isOpen} />
      </Modal.Section>

      <Modal.Section title={translate('settings.autoGroupTiles')}>
        <AutoGroupTilesSetting disabled={!isOpen} />
      </Modal.Section>
    </Modal>
  );
};

export default SettingsModal;
