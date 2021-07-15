import React from 'react';

import { arrowDown, arrowLeft, arrowRight, arrowUp } from 'icons';
import { isMac } from 'lib';

import Key from '../Key';
import SvgIcon from '../SvgIcon';

export const ARROW_DOWN = (
  <Key>
    <SvgIcon icon={arrowLeft} />
  </Key>
);

export const ARROW_LEFT = (
  <Key>
    <SvgIcon icon={arrowUp} />
  </Key>
);

export const ARROW_RIGHT = (
  <Key>
    <SvgIcon icon={arrowRight} />
  </Key>
);

export const ARROW_UP = (
  <Key>
    <SvgIcon icon={arrowDown} />
  </Key>
);

export const B = <Key>B</Key>;

export const BACKSPACE = <Key>← Backspace</Key>;

export const CTRL = <Key>{isMac() ? '⌘' : 'Ctrl'}</Key>;

export const DEL = <Key>Del</Key>;

export const ENTER = <Key>Enter ⏎</Key>;

export const SHIFT = <Key>Shift ⇧</Key>;

export const ARROWS = (
  <>
    {ARROW_DOWN}
    {ARROW_LEFT}
    {ARROW_RIGHT}
    {ARROW_UP}
  </>
);

export const SPACE = <Key>␣</Key>;

const mapping = {
  insertBlank: [SPACE],
  navigate: [ARROWS],
  removeTile: [DEL, BACKSPACE],
  submit: [ENTER],
  toggleBlank: [[CTRL, B]],
  toggleDirection: [[CTRL, ARROWS]],
};

export default mapping;
