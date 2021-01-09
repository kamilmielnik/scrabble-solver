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
        <Mapping mapping={mapping.navigate} description="nawigacja" />
        <Mapping mapping={mapping.insertTile} description="wstaw płytkę z daną literą" />
        <Mapping mapping={mapping.removeTile} description="zdejmij płytkę" />
        <Mapping mapping={mapping.submit} description="rozpocznij wyszukiwanie" />
      </Sidebar.Section>

      <Sidebar.Section title={translate('keyMap.board')}>
        <Mapping
          mapping={mapping.toggleBlank}
          description="oznacz/odznacz płytkę jako blank (płytka musi być wcześniej umieszczona na polu)"
        />
        <Mapping mapping={mapping.setVerticalTypingDirection} description="zmień kierunek wpisywania na pionowy" />
        <Mapping mapping={mapping.setHorizontalTypingDirection} description="zmień kierunek wpisywania na poziomy" />
      </Sidebar.Section>

      <Sidebar.Section title={translate('keyMap.tiles')}>
        <Mapping mapping={mapping.insertBlank} description="(spacja) wstaw blanka" />
      </Sidebar.Section>
    </Sidebar>
  );
};

export default KeyMap;
