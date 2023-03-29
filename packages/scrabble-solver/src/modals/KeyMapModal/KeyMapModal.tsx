import { FunctionComponent, memo } from 'react';

import { Key, Modal } from 'components';
import { selectConfig, useTranslate, useTypedSelector } from 'state';

import { Mapping } from './components';
import { ARROWS, BACKSPACE, CTRL, DEL, ENTER, SPACE } from './keys';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const KeyMapModal: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const translate = useTranslate();
  const config = useTypedSelector(selectConfig);

  return (
    <Modal className={className} isOpen={isOpen} title={translate('keyMap')} onClose={onClose}>
      <Modal.Section title={translate('keyMap.board-and-rack')}>
        <Mapping description={translate('keyMap.board-and-rack.navigate')} mapping={[ARROWS]} />
        <Mapping description={translate('keyMap.board-and-rack.remove-tile')} mapping={[DEL, BACKSPACE]} />
        <Mapping description={translate('keyMap.board-and-rack.submit')} mapping={[ENTER]} />
        {config.twoCharacterTiles.length > 0 && (
          <Mapping
            description={translate('keyMap.board-and-rack.insert-two-letter-tile')}
            mapping={[
              [
                CTRL,
                <>
                  {config.twoCharacterTiles.map(([firstLetter]) => (
                    <Key key={firstLetter}>{firstLetter.toUpperCase()}</Key>
                  ))}
                </>,
              ],
            ]}
          />
        )}
      </Modal.Section>

      <Modal.Section title={translate('keyMap.board')}>
        <Mapping description={translate('keyMap.board.toggle-blank')} mapping={[SPACE, [CTRL, <Key key="b">B</Key>]]} />
        <Mapping description={translate('keyMap.board.toggle-direction')} mapping={[ARROWS]} />
      </Modal.Section>

      <Modal.Section title={translate('keyMap.rack')}>
        <Mapping description={translate('keyMap.rack.insert-blank')} mapping={[SPACE]} />
      </Modal.Section>
    </Modal>
  );
};

export default memo(KeyMapModal);
