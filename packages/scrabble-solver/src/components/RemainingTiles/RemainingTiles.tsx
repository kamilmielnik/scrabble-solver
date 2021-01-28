import React, { FunctionComponent } from 'react';
import { useKey } from 'react-use';

import { useTranslate } from 'state';

import Sidebar from '../Sidebar';

interface Props {
  className?: string;
  hidden: boolean;
  onClose: () => void;
}

const RemainingTiles: FunctionComponent<Props> = ({ className, hidden, onClose }) => {
  const translate = useTranslate();

  const handleClose = () => {
    if (!hidden) {
      onClose();
    }
  };

  useKey('Escape', handleClose, { event: 'keydown' }, [handleClose]);

  return (
    <Sidebar className={className} hidden={hidden} title={translate('remaining-tiles')} onClose={handleClose}>
      TODO
    </Sidebar>
  );
};

export default RemainingTiles;
