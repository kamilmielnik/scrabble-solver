import React, { FunctionComponent, ReactNode } from 'react';

import styles from './SquareButton.module.scss';

interface Props {
  children?: ReactNode;
  Icon: SvgComponent;
}

const Content: FunctionComponent<Props> = ({ children, Icon }) => (
  <span className={styles.content}>
    <Icon className={styles.icon} />
    <span className={styles.label}>{children}</span>
  </span>
);

export default Content;
