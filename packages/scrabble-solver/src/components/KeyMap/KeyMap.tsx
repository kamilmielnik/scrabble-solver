import React, { FunctionComponent } from 'react';
import { useKey } from 'react-use';

import { isMac } from 'lib';
import { useTranslate } from 'state';

import Key from '../Key';
import Sidebar from '../Sidebar';

import styles from './KeyMap.module.scss';

interface Props {
  className?: string;
  hidden: boolean;
  onClose: () => void;
}

const CTRL_KEY = isMac() ? '⌘' : 'Ctrl';

const KeyMap: FunctionComponent<Props> = ({ className, hidden, onClose }) => {
  const translate = useTranslate();
  const title = `${translate('keyMap.board')} & ${translate('keyMap.tiles').toLowerCase()}`;

  useKey('Escape', onClose, { event: 'keydown' }, [onClose]);

  return (
    <Sidebar className={className} hidden={hidden} title={translate('keyMap')} onClose={onClose}>
      <Sidebar.Section title={title}>
        <div className={styles.entry}>
          <Key>←</Key>, <Key>↑</Key>, <Key>↓</Key>, <Key>→</Key> - nawigacja
        </div>

        <div className={styles.entry}>
          <Key>A</Key>, <Key>B</Key>, <Key>C</Key>... - wstaw płytkę z daną literą
        </div>

        <div className={styles.entry}>
          <Key>Del</Key>, <Key>Backspace</Key> - zdejmij płytkę
        </div>

        <div className={styles.entry}>
          <Key>Enter ⏎</Key> - rozpocznij wyszukiwanie
        </div>
      </Sidebar.Section>

      <Sidebar.Section title={translate('keyMap.board')}>
        <div className={styles.entry}>
          <Key>{CTRL_KEY}</Key> + <Key>B</Key> - oznacz/odznacz płytkę jako blank (płytka musi być wcześniej umieszczona
          na polu)
        </div>

        <div className={styles.entry}>
          <Key>{CTRL_KEY}</Key> + <Key>↑</Key>, <Key>{CTRL_KEY}</Key> + <Key>↓</Key> - zmień kierunek wpisywania na
          pionowy
        </div>

        <div className={styles.entry}>
          <Key>{CTRL_KEY}</Key> + <Key>←</Key>, <Key>{CTRL_KEY}</Key> + <Key>→</Key> - zmień kierunek wpisywania na
          poziomy
        </div>
      </Sidebar.Section>

      <Sidebar.Section title={translate('keyMap.tiles')}>
        <div className={styles.entry}>
          <Key>␣</Key> (spacja) - umieść blanka na stojaku
        </div>
      </Sidebar.Section>
    </Sidebar>
  );
};

export default KeyMap;
