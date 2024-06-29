import { Key } from 'components';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'icons';
import { isMac } from 'lib';
import { useTranslate } from 'state';

export const ARROW_DOWN = (
  <Key>
    <ArrowLeft />
  </Key>
);

export const ARROW_LEFT = (
  <Key>
    <ArrowUp />
  </Key>
);

export const ARROW_RIGHT = (
  <Key>
    <ArrowRight />
  </Key>
);

export const ARROW_UP = (
  <Key>
    <ArrowDown />
  </Key>
);

export const BACKSPACE = <Key>← Backspace</Key>;

export const CTRL = <Key>{isMac() ? '⌘' : 'Ctrl'}</Key>;

export const DEL = <Key>Del</Key>;

export const ENTER = <Key>Enter ⏎</Key>;

export const ARROWS = (
  <>
    {ARROW_DOWN}
    {ARROW_LEFT}
    {ARROW_RIGHT}
    {ARROW_UP}
  </>
);

export const Space = () => {
  const translate = useTranslate();

  return <Key>{`  ${translate('common.space')}  `}</Key>;
};
