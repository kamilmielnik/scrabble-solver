import React, { FunctionComponent } from 'react';

import { selectConfig, useTranslate, useTypedSelector } from 'state';

import Key from '../Key';
import Sidebar from '../Sidebar';

import { Mapping } from './components';
import mapping, { SHIFT } from './mapping';

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
        <Mapping description={translate('keyMap.board-and-rack.navigate')} mapping={mapping.navigate} />
        <Mapping description={translate('keyMap.board-and-rack.remove-tile')} mapping={mapping.removeTile} />
        <Mapping description={translate('keyMap.board-and-rack.submit')} mapping={mapping.submit} />
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
        <Mapping description={translate('keyMap.board.toggle-blank')} mapping={mapping.toggleBlank} />
        <Mapping description={translate('keyMap.board.toggle-direction')} mapping={mapping.toggleDirection} />
      </Sidebar.Section>

      <Sidebar.Section title={translate('keyMap.rack')}>
        <Mapping description={translate('keyMap.rack.insert-blank')} mapping={mapping.insertBlank} />
      </Sidebar.Section>
    </Sidebar>
  );
};

export default KeyMap;
