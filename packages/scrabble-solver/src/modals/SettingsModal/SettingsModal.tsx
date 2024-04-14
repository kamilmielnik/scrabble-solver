import { FunctionComponent, memo } from 'react';

import { Modal } from 'components';
import { useIsTouchDevice } from 'hooks';
import { useTranslate } from 'state';

import {
  AutoGroupTilesSetting,
  ConfigSetting,
  InputModeSetting,
  LocaleSetting,
  ShowCoordinatesSetting,
} from './components';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const translate = useTranslate();
  const isTouchDevice = useIsTouchDevice();

  return (
    <Modal className={className} isOpen={isOpen} title={translate('settings')} onClose={onClose}>
      <Modal.Section title={translate('settings.game')}>
        <ConfigSetting disabled={!isOpen} />
      </Modal.Section>

      <Modal.Section title={translate('settings.language')}>
        <LocaleSetting disabled={!isOpen} />
      </Modal.Section>

      <Modal.Section title={translate('settings.showCoordinates')}>
        <ShowCoordinatesSetting disabled={!isOpen} />
      </Modal.Section>

      {!isTouchDevice && (
        <Modal.Section title={translate('settings.inputMode')}>
          <InputModeSetting disabled={!isOpen} />
        </Modal.Section>
      )}

      <Modal.Section title={translate('settings.autoGroupTiles')}>
        <AutoGroupTilesSetting disabled={!isOpen} />
      </Modal.Section>
    </Modal>
  );
};

export default memo(SettingsModal);
