import { FunctionComponent, memo } from 'react';

import { Modal } from 'components';
import { useTranslate } from 'state';

import { Mapping } from './components';
import { ARROWS, BACKSPACE, DEL, ENTER, SPACE } from './keys';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const KeyMapModal: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const translate = useTranslate();

  return (
    <Modal className={className} isOpen={isOpen} title={translate('keyMap')} onClose={onClose}>
      <Modal.Section title={translate('keyMap.board-and-rack')}>
        <Mapping description={translate('keyMap.board-and-rack.navigate')} mapping={[ARROWS]} />
        <Mapping description={translate('keyMap.board-and-rack.remove-tile')} mapping={[DEL, BACKSPACE]} />
        <Mapping description={translate('keyMap.board-and-rack.submit')} mapping={[ENTER]} />
      </Modal.Section>

      <Modal.Section title={translate('keyMap.board')}>
        <Mapping description={translate('keyMap.board.toggle-blank')} mapping={[SPACE]} />
        <Mapping description={translate('keyMap.board.toggle-direction')} mapping={[ARROWS]} />
      </Modal.Section>

      <Modal.Section title={translate('keyMap.rack')}>
        <Mapping description={translate('keyMap.rack.insert-blank')} mapping={[SPACE]} />
      </Modal.Section>
    </Modal>
  );
};

export default memo(KeyMapModal);
