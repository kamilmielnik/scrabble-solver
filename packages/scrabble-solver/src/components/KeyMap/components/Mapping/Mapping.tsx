import classNames from 'classnames';
import { Fragment, FunctionComponent, ReactNode } from 'react';

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
        <Fragment key={index}>
          <div className={styles.group}>
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

          {mapping.length > 1 && index < mapping.length - 1 && <span className={styles.slash}>/</span>}
        </Fragment>
      ))}
    </div>
  </div>
);

export default Mapping;
