import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { FlagGb, FlagPl, FlagUs } from 'components/icons';

import Locale from './locale';
import styles from './locales.module.scss';

const locales = [
  {
    locale: 'pl-PL',
    definitions: {
      name: 'Słownik SJP.PL',
      url: 'https://sjp.pl/'
    },
    dictionary: {
      name: 'Słownik SJP.PL',
      url: 'https://sjp.pl/slownik/growy/'
    },
    FlagComponent: FlagPl
  },
  {
    locale: 'en-GB',
    definitions: {
      name: 'Wordnik',
      url: 'http://wordnik.com/'
    },
    dictionary: {
      name: 'SOWPODS',
      url: 'https://www.wordgamedictionary.com/sowpods/'
    },
    FlagComponent: FlagGb
  },
  {
    locale: 'en-US',
    definitions: {
      name: 'Wordnik',
      url: 'http://wordnik.com/'
    },
    dictionary: {
      name: 'TWL06',
      url: 'https://www.wordgamedictionary.com/twl06/'
    },
    FlagComponent: FlagUs
  }
];

const Locales = ({ className }) => (
  <div className={classNames(styles.locales, className)}>
    {locales.map((locale, index) => (
      <Locale key={index} className={styles.locale} {...locale} />
    ))}
  </div>
);

Locales.propTypes = {
  className: PropTypes.string
};

export default Locales;
