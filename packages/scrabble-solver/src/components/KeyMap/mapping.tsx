import React from 'react';

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'icons';
import { isMac } from 'lib';

import Key from '../Key';

const ARROW_DOWN = (
  <Key>
    <ArrowLeft />
  </Key>
);

const ARROW_LEFT = (
  <Key>
    <ArrowUp />
  </Key>
);

const ARROW_RIGHT = (
  <Key>
    <ArrowRight />
  </Key>
);

const ARROW_UP = (
  <Key>
    <ArrowDown />
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
