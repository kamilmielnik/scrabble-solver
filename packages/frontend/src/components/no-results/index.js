import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Message } from 'i18n';

import styles from './no-results.module.scss';

const NoResults = ({ className }) => (
  <div className={classNames(styles.noResults, className)}>
    <Message id="components.no-results" />
  </div>
);

NoResults.propTypes = {
  className: PropTypes.string
};

export default NoResults;
