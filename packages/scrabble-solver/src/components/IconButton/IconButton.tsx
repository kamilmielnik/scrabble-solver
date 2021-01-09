import classNames from 'classnames';
import React, { FunctionComponent, MouseEventHandler } from 'react';

import { SvgIcon } from 'components';

import styles from './IconButton.module.scss';

interface Props {
  className?: string;
  disabled?: boolean;
  icon: BrowserSpriteSymbol;
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const IconButton: FunctionComponent<Props> = ({ className, disabled, icon, title, onClick }) => (
  <button
    className={classNames(styles.button, className)}
    disabled={disabled}
    title={title}
    type="button"
    onClick={onClick}
  >
    <SvgIcon className={styles.icon} icon={icon} />
  </button>
);

export default IconButton;
