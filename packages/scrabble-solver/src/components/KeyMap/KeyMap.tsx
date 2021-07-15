import React, { FunctionComponent } from 'react';

import { selectConfig, useTranslate, useTypedSelector } from 'state';

import Key from '../Key';
import Sidebar from '../Sidebar';

import { Mapping } from './components';
import { ARROWS, BACKSPACE, CTRL, DEL, ENTER, SHIFT, SPACE } from './keys';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const KeyMap: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const translate = useTranslate();
  const config = useTypedSelector(selectConfig);

  return (
    <Sidebar className={className} isOpen={isOpen} title={translate('keyMap')} onClose={onClose}>
      <Sidebar.Section title={translate('keyMap.board-and-rack')}>
        <Mapping description={translate('keyMap.board-and-rack.navigate')} mapping={[ARROWS]} />
        <Mapping description={translate('keyMap.board-and-rack.remove-tile')} mapping={[DEL, BACKSPACE]} />
        <Mapping description={translate('keyMap.board-and-rack.submit')} mapping={[ENTER]} />
        {config.twoCharacterTiles.length > 0 && (
          <Mapping
            description={translate('keyMap.board-and-rack.insert-two-letter-tile')}
            mapping={[
              [
                SHIFT,
                <>
                  {config.twoCharacterTiles.map(([firstLetter]) => (
                    <Key>{firstLetter.toUpperCase()}</Key>
                  ))}
                </>,
              ],
            ]}
          />
        )}
      </Sidebar.Section>

      <Sidebar.Section title={translate('keyMap.board')}>
        <Mapping description={translate('keyMap.board.toggle-blank')} mapping={[[CTRL, <Key>B</Key>]]} />
        <Mapping description={translate('keyMap.board.toggle-direction')} mapping={[[CTRL, ARROWS]]} />
      </Sidebar.Section>

      <Sidebar.Section title={translate('keyMap.rack')}>
        <Mapping description={translate('keyMap.rack.insert-blank')} mapping={[SPACE]} />
      </Sidebar.Section>
    </Sidebar>
  );
};

export default KeyMap;
