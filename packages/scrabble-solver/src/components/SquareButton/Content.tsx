import React, { FunctionComponent, ReactNode } from 'react';

import { SvgIcon } from 'components';

import styles from './SquareButton.module.scss';

interface Props {
  children?: ReactNode;
  icon: BrowserSpriteSymbol;
}

const Content: FunctionComponent<Props> = ({ children, icon }) => (
  <span className={styles.content}>
    <SvgIcon className={styles.icon} icon={icon} />
    <span className={styles.label}>{children}</span>
  </span>
);

export default Content;
