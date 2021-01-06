import classNames from 'classnames';
import React, { FunctionComponent, MouseEventHandler } from 'react';

import { SvgIcon } from 'components';

import styles from './IconButton.module.scss';

interface Props {
  className?: string;
  icon: BrowserSpriteSymbol;
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const IconButton: FunctionComponent<Props> = ({ className, icon, title, onClick }) => (
  <button className={classNames(styles.button, className)} title={title} type="button" onClick={onClick}>
    <SvgIcon className={styles.icon} icon={icon} />
  </button>
);

export default IconButton;
