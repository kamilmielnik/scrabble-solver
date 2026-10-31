import { type FunctionComponent, memo } from 'react';

import { Key } from '@/components/Key';
import { Arrows, Backspace, Ctrl, Del, Enter, Space } from '@/components/Keys';
import { Modal } from '@/components/Modal';
import { selectConfig, selectLocale, useTranslate, useTypedSelector } from '@/state';

import { Mapping } from './components';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const KeyMapModalBase: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const translate = useTranslate();
  const config = useTypedSelector(selectConfig);
  const locale = useTypedSelector(selectLocale);

  return (
    <Modal className={className} isOpen={isOpen} title={translate('keyMap')} onClose={onClose}>
      <Modal.Section label={translate('keyMap.board-and-rack')} title={translate('keyMap.board-and-rack')}>
        <Mapping description={translate('keyMap.board-and-rack.navigate')} mapping={[<Arrows key="arrows" />]} />

        <Mapping
          description={translate('keyMap.board-and-rack.remove-tile')}
          mapping={[<Del key="del" />, <Backspace key="backspace" />]}
        />

        <Mapping description={translate('keyMap.board-and-rack.submit')} mapping={[<Enter key="del" />]} />

        {config.digraphs.map((digraph) => (
          <Mapping
            description={`${translate('keyMap.board-and-rack.insert-digraph')} ${digraph.toLocaleUpperCase(locale)}`}
            key={digraph}
            mapping={[
              [
                <Ctrl key="ctrl" />,
                <Key key={digraph}>{config.getDigraphShortcut(digraph).toLocaleUpperCase(locale)}</Key>,
              ],
            ]}
          />
        ))}
      </Modal.Section>

      <Modal.Section label={translate('keyMap.board')} title={translate('keyMap.board')}>
        <Mapping description={translate('keyMap.board.toggle-direction')} mapping={[<Arrows key="arrows" />]} />
        <Mapping description={translate('keyMap.board.toggle-blank')} mapping={[<Space key="space" />]} />
        <Mapping
          description={translate('keyMap.board.toggle-cell-filter')}
          mapping={[[<Ctrl key="ctrl" />, <Key key="g">G</Key>]]}
        />
      </Modal.Section>

      <Modal.Section label={translate('keyMap.rack')} title={translate('keyMap.rack')}>
        <Mapping description={translate('keyMap.rack.insert-blank')} mapping={[<Space key="space" />]} />
      </Modal.Section>
    </Modal>
  );
};

export const KeyMapModal = memo(KeyMapModalBase);
