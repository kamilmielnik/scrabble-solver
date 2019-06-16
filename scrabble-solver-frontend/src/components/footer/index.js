import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Copyright from 'components/copyright';
import Link from 'components/link';
import styles from './footer.module.scss';

const email = 'kamil.adam.mielnik@gmail.com';

const Footer = ({ className }) => (
  <footer className={classNames(styles.footer, className)}>
    <div className={styles.row}>
      Design & Development
    </div>

    <Copyright className={styles.row} />

    <div className={styles.row}>
      <Link className={styles.link} href={`mailto:${email}`}>{email}</Link>
    </div>
  </footer>
);

Footer.propTypes = {
  className: PropTypes.string
};

export default Footer;
