import React, { FunctionComponent, ReactNode } from 'react';

import styles from './Button.module.scss';

interface Props {
  children?: ReactNode;
  Icon: SvgComponent;
}

const Content: FunctionComponent<Props> = ({ children, Icon }) => (
  <span className={styles.content}>
    <span className={styles.label}>{children}</span>
    <Icon className={styles.icon} />
  </span>
);

export default Content;
