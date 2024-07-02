import { FunctionComponent } from 'react';

import { isMac } from 'lib';
import { useTranslate } from 'state';

import Key from './Key';

interface Props {
  className?: string;
}

export const Backspace: FunctionComponent<Props> = ({ className }) => <Key className={className}>← Backspace</Key>;

export const Ctrl: FunctionComponent<Props> = ({ className }) => (
  <Key className={className}>{isMac() ? '⌘' : 'Ctrl'}</Key>
);

export const Del: FunctionComponent<Props> = ({ className }) => <Key className={className}>Del</Key>;

export const Enter: FunctionComponent<Props> = ({ className }) => <Key className={className}>Enter ⏎</Key>;

export const Space: FunctionComponent<Props> = ({ className }) => {
  const translate = useTranslate();

  return <Key className={className}>{` ${translate('common.space')} `}</Key>;
};
