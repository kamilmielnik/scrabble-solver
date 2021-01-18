import React, { FunctionComponent, ReactNode } from 'react';

import { SvgIcon } from 'components';

import styles from './Button.module.scss';

interface Props {
  children?: ReactNode;
  icon: BrowserSpriteSymbol;
}

const Content: FunctionComponent<Props> = ({ children, icon }) => (
  <span className={styles.content}>
    <span className={styles.label}>{children}</span>
    <SvgIcon className={styles.icon} icon={icon} />
  </span>
);

export default Content;
