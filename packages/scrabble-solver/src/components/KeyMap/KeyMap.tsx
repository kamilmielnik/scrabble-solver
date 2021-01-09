import React, { FunctionComponent } from 'react';
import { useKey } from 'react-use';

import { useTranslate } from 'state';

import Sidebar from '../Sidebar';

import { Mapping } from './components';
import styles from './KeyMap.module.scss';
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
        <div className={styles.entry}>
          <Mapping mapping={mapping.navigate} /> - nawigacja
        </div>

        <div className={styles.entry}>
          <Mapping mapping={mapping.insertTile} /> - wstaw płytkę z daną literą
        </div>

        <div className={styles.entry}>
          <Mapping mapping={mapping.removeTile} /> - zdejmij płytkę
        </div>

        <div className={styles.entry}>
          <Mapping mapping={mapping.submit} /> - rozpocznij wyszukiwanie
        </div>
      </Sidebar.Section>

      <Sidebar.Section title={translate('keyMap.board')}>
        <div className={styles.entry}>
          <Mapping mapping={mapping.toggleBlank} /> - oznacz/odznacz płytkę jako blank (płytka musi być wcześniej
          umieszczona na polu)
        </div>

        <div className={styles.entry}>
          <Mapping mapping={mapping.setVerticalTypingDirection} /> - zmień kierunek wpisywania na pionowy
        </div>

        <div className={styles.entry}>
          <Mapping mapping={mapping.setHorizontalTypingDirection} /> - zmień kierunek wpisywania na poziomy
        </div>
      </Sidebar.Section>

      <Sidebar.Section title={translate('keyMap.tiles')}>
        <div className={styles.entry}>
          <Mapping mapping={mapping.insertBlank} /> (spacja) - wstaw blanka
        </div>
      </Sidebar.Section>
    </Sidebar>
  );
};

export default KeyMap;
