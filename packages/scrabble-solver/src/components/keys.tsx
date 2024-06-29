import { FunctionComponent } from 'react';

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'icons';
import { isMac } from 'lib';
import { useTranslate } from 'state';

import Key from './Key';

interface Props {
  className?: string;
  size?: 'small' | 'medium';
}

export const Backspace: FunctionComponent<Props> = ({ className, size }) => (
  <Key className={className} size={size}>
    ← Backspace
  </Key>
);

export const Ctrl: FunctionComponent<Props> = ({ className, size }) => (
  <Key className={className} size={size}>
    {isMac() ? '⌘' : 'Ctrl'}
  </Key>
);

export const Del: FunctionComponent<Props> = ({ className, size }) => (
  <Key className={className} size={size}>
    Del
  </Key>
);

export const Enter: FunctionComponent<Props> = ({ className, size }) => (
  <Key className={className} size={size}>
    Enter ⏎
  </Key>
);

export const Arrows: FunctionComponent<Props> = ({ className, size }) => {
  return (
    <div className={className}>
      <Key size={size}>
        <ArrowLeft />
      </Key>
      <Key size={size}>
        <ArrowUp />
      </Key>
      <Key size={size}>
        <ArrowRight />
      </Key>
      <Key size={size}>
        <ArrowDown />
      </Key>
    </div>
  );
};

export const Space: FunctionComponent<Props> = ({ className, size }) => {
  const translate = useTranslate();

  return <Key className={className} size={size}>{`  ${translate('common.space')}  `}</Key>;
};
