import React, { Children } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const Separators = ({ children }) => (
  <div className={styles.separators}>
    {Children.toArray(children).reduce((newChildren, child, index) => {
      newChildren.push(child);

      if(index < children.length - 1) {
        newChildren.push((
          <span key={`separator-${index}`} className={styles.separator}>|</span>
        ));
      }

      return newChildren;
    }, [])}
  </div>
);

Separators.propTypes = {
  children: PropTypes.node.isRequired
};

export default Separators;
