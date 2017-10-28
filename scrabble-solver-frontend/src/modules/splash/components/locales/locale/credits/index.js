import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Message } from 'i18n/components';
import styles from './styles.scss';

const Credits = ({ className, locale, messageId, name, url }) => (
  <div className={classNames(styles.credits, className)}>
    <span className={styles.message}>
      <Message id={messageId} locale={locale} />
    </span>
    <a href={url}>
      {name}
    </a>
  </div>
);

Credits.propTypes = {
  className: PropTypes.string,
  locale: PropTypes.string.isRequired,
  messageId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

export default Credits;
