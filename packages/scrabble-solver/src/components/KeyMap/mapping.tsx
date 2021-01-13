import React from 'react';

import { arrowDown, arrowLeft, arrowRight, arrowUp } from 'icons';
import { isMac } from 'lib';

import Key from '../Key';
import SvgIcon from '../SvgIcon';

const ARROW_DOWN = (
  <Key>
    <SvgIcon icon={arrowLeft} />
  </Key>
);

const ARROW_LEFT = (
  <Key>
    <SvgIcon icon={arrowUp} />
  </Key>
);

const ARROW_RIGHT = (
  <Key>
    <SvgIcon icon={arrowRight} />
  </Key>
);

const ARROW_UP = (
  <Key>
    <SvgIcon icon={arrowDown} />
  </Key>
);

const B = <Key>B</Key>;

const BACKSPACE = <Key>← Backspace</Key>;

const CTRL = <Key>{isMac() ? '⌘' : 'Ctrl'}</Key>;

const DEL = <Key>Del</Key>;

const ENTER = <Key>Enter ⏎</Key>;

const ARROWS = (
  <>
    {ARROW_DOWN}
    {ARROW_LEFT}
    {ARROW_RIGHT}
    {ARROW_UP}
  </>
);

const SPACE = <Key>␣</Key>;

const mapping = {
  insertBlank: [SPACE],
  navigate: [ARROWS],
  removeTile: [DEL, BACKSPACE],
  submit: [ENTER],
  toggleBlank: [[CTRL, B]],
  toggleDirection: [[CTRL, ARROWS]],
};

export default mapping;
