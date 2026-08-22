import { type FunctionComponent, type ReactNode } from 'react';

import styles from './Table.module.scss';

interface Props {
  children: ReactNode;
}

export const Header: FunctionComponent<Props> = ({ children }) => {
  return <div className={styles.header}>{children}</div>;
};
