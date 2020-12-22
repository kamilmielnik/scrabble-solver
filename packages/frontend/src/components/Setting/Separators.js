import React, { Children } from 'react';
import PropTypes from 'prop-types';

import styles from './Separators.module.scss';

const Separators = ({ children, separator }) => (
  <div className={styles.separators}>
    {Children.toArray(children).reduce((newChildren, child, index) => {
      newChildren.push(child);

      if (index < children.length - 1) {
        newChildren.push(
          <span className={styles.separator} key={`separator-${index}`}>
            {separator}
          </span>,
        );
      }

      return newChildren;
    }, [])}
  </div>
);

Separators.propTypes = {
  children: PropTypes.node.isRequired,
  separator: PropTypes.string.isRequired,
};

export default Separators;
