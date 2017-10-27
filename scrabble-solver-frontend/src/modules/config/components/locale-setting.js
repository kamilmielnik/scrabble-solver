import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { updateIntl } from 'react-intl-redux';
import * as intl from 'intl';
import { selectLocale } from 'config/selectors';
import FlagGb from 'components/icons/flag-gb';
import FlagPl from 'components/icons/flag-pl';
import styles from './styles.scss';

const locales = [
  { locale: 'pl', FlagComponent: FlagPl },
  { locale: 'en', FlagComponent: FlagGb }
];

const LocaleSetting = ({ value, onChange }) => (
  <div className={styles.locales}>
    {locales.map(({ locale, FlagComponent }) => (
      <FlagComponent
        key={locale}
        className={classNames(
          styles.locale,
          {
            [styles.selected]: value === locale
          }
        )}
        onClick={() => onChange(locale)} />
    ))}
  </div>
);

LocaleSetting.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  value: selectLocale(state)
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (locale) => dispatch(updateIntl(intl[locale]))
});

export default connect(mapStateToProps, mapDispatchToProps)(LocaleSetting);
