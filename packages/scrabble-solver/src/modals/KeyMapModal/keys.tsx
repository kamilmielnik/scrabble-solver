import { Key } from 'components';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'icons';
import { isMac } from 'lib';
import { useTranslate } from 'state';

export const Backspace = () => <Key>← Backspace</Key>;

export const Ctrl = () => <Key>{isMac() ? '⌘' : 'Ctrl'}</Key>;

export const Del = () => <Key>Del</Key>;

export const Enter = () => <Key>Enter ⏎</Key>;

export const Arrows = ({ className, size = 'medium' }: { className?: string; size?: 'small' | 'medium' }) => {
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

export const Space = () => {
  const translate = useTranslate();

  return <Key>{`  ${translate('common.space')}  `}</Key>;
};
