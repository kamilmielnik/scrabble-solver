import React, { Children } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

const Separators = ({ children, className }) => (
  <div className={classNames(styles.separators, className)}>
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
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Separators;
