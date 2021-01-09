import { Fragment, FunctionComponent, ReactNode } from 'react';

interface Props {
  mapping: (ReactNode | ReactNode[])[];
}

const Mapping: FunctionComponent<Props> = ({ mapping }) => (
  <>
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
  </>
);

export default Mapping;
