import classNames from 'classnames';
import React, { FunctionComponent, ReactNode } from 'react';

import styles from './Mapping.module.scss';

interface Props {
  className?: string;
  description: string;
  mapping: (ReactNode | ReactNode[])[];
}

const Mapping: FunctionComponent<Props> = ({ className, description, mapping }) => (
  <div className={classNames(styles.mapping, className)}>
    <h3 className={styles.description}>{description}</h3>

    <div className={styles.keys}>
      {mapping.map((key, index) => (
        <div className={styles.group} key={index}>
          {Array.isArray(key) ? (
            <>
              {key[0]}
              <span className={styles.plus}>+</span>
              {key[1]}
            </>
          ) : (
            key
          )}
        </div>
      ))}
    </div>
  </div>
);

export default Mapping;
