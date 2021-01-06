import classNames from 'classnames';
import React, { FunctionComponent, MouseEventHandler } from 'react';

import { SvgIcon } from 'components';
import { cog } from 'icons';
import { useTranslation } from 'state';

import styles from './SettingsButton.module.scss';

interface Props {
  className?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const SettingsButton: FunctionComponent<Props> = ({ className, onClick }) => {
  const titleTranslation = useTranslation('settings');

  return (
    <button
      className={classNames(styles.settingsButton, className)}
      title={titleTranslation}
      type="button"
      onClick={onClick}
    >
      <SvgIcon className={styles.icon} icon={cog} />
    </button>
  );
};

export default SettingsButton;
