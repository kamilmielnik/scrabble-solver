import classNames from 'classnames';
import { FunctionComponent, ReactNode } from 'react';

import styles from './Section.module.scss';

interface Props {
  children: ReactNode;
  className?: string;
  label: string;
  title: ReactNode;
}

const Section: FunctionComponent<Props> = ({ children, className, label, title }) => (
  <section aria-label={label} className={classNames(styles.section, className)}>
    <h2 className={styles.heading}>{title}</h2>
    <div>{children}</div>
  </section>
);

export default Section;
