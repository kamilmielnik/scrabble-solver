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
    {mapping.map((key, index) => (
      <Fragment key={index}>
        {Array.isArray(key) ? (
          <>
            {key[0]} + {key[1]}
          </>
        ) : (
          key
        )}

        {index === mapping.length - 1 ? '' : ', '}
      </Fragment>
    ))}
    {' - '}
    {description}
  </div>
);

export default Mapping;
