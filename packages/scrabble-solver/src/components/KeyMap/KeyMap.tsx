import React, { FunctionComponent } from 'react';
import { useKey } from 'react-use';

import { useTranslate } from 'state';

import Sidebar from '../Sidebar';

import { Mapping } from './components';
import mapping from './mapping';

interface Props {
  className?: string;
  hidden: boolean;
  onClose: () => void;
}

const KeyMap: FunctionComponent<Props> = ({ className, hidden, onClose }) => {
  const translate = useTranslate();

  useKey('Escape', onClose, { event: 'keydown' }, [onClose]);

  return (
    <Sidebar className={className} hidden={hidden} title={translate('keyMap')} onClose={onClose}>
      <Sidebar.Section title={translate('keyMap.board-and-tiles')}>
        <Mapping description="nawigacja" mapping={mapping.navigate} />
        <Mapping description="wstaw płytkę z daną literą" mapping={mapping.insertTile} />
        <Mapping description="zdejmij płytkę" mapping={mapping.removeTile} />
        <Mapping description="rozpocznij wyszukiwanie" mapping={mapping.submit} />
      </Sidebar.Section>

      <Sidebar.Section title={translate('keyMap.board')}>
        <Mapping
          description="oznacz/odznacz płytkę jako blank (płytka musi być wcześniej umieszczona na polu)"
          mapping={mapping.toggleBlank}
        />
        <Mapping description="zmień kierunek wpisywania na pionowy" mapping={mapping.setVerticalTypingDirection} />
        <Mapping description="zmień kierunek wpisywania na poziomy" mapping={mapping.setHorizontalTypingDirection} />
      </Sidebar.Section>

      <Sidebar.Section title={translate('keyMap.tiles')}>
        <Mapping description="(spacja) wstaw blanka" mapping={mapping.insertBlank} />
      </Sidebar.Section>
    </Sidebar>
  );
};

export default KeyMap;
