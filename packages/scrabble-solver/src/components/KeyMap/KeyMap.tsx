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
        <Mapping description={translate('keyMap.board-and-tiles.navigate')} mapping={mapping.navigate} />
        <Mapping description={translate('keyMap.board-and-tiles.insert-tile')} mapping={mapping.insertTile} />
        <Mapping description={translate('keyMap.board-and-tiles.remove-tile')} mapping={mapping.removeTile} />
        <Mapping description={translate('keyMap.board-and-tiles.submit')} mapping={mapping.submit} />
      </Sidebar.Section>

      <Sidebar.Section title={translate('keyMap.board')}>
        <Mapping description={translate('keyMap.board.toggle-blank')} mapping={mapping.toggleBlank} />
        <Mapping description={translate('keyMap.board.direction-horizontal')} mapping={mapping.directionVertical} />
        <Mapping description={translate('keyMap.board.direction-vertical')} mapping={mapping.directionHorizontal} />
      </Sidebar.Section>

      <Sidebar.Section title={translate('keyMap.tiles')}>
        <Mapping description={translate('keyMap.tiles.insert-blank')} mapping={mapping.insertBlank} />
      </Sidebar.Section>
    </Sidebar>
  );
};

export default KeyMap;
