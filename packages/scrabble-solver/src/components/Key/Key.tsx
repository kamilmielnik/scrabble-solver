import classNames from 'classnames';
import React, { FunctionComponent, ReactNode } from 'react';

import { isMac } from 'lib';

import styles from './Key.module.scss';

interface Props {
  children: ReactNode;
  className?: string;
}

const Key: FunctionComponent<Props> = ({ children, className }) => (
  <kbd className={classNames(styles.key, className)}>{children}</kbd>
);

export default Object.assign(Key, {
  A: <Key>A</Key>,
  ARROW_DOWN: <Key>↓</Key>,
  ARROW_LEFT: <Key>←</Key>,
  ARROW_RIGHT: <Key>→</Key>,
  ARROW_UP: <Key>↑</Key>,
  B: <Key>B</Key>,
  BACKSPACE: <Key>← Backspace</Key>,
  C: <Key>C</Key>,
  CTRL: <Key>{isMac() ? '⌘' : 'Ctrl'}</Key>,
  DEL: <Key>Del</Key>,
  ENTER: <Key>Enter ⏎</Key>,
  SPACE: <Key>␣</Key>,
});
