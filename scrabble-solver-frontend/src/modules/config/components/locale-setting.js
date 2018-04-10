import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { changeLocale } from 'i18n/state';
import { selectLocale } from 'i18n/selectors';
import { FlagGb, FlagPl, FlagUs } from 'components/icons';
import styles from './styles.scss';

const locales = [
  { locale: 'pl-PL', FlagComponent: FlagPl },
  { locale: 'en-GB', FlagComponent: FlagGb },
  { locale: 'en-US', FlagComponent: FlagUs }
];

const LocaleSetting = ({ value, onChange }) => (
  <div className={styles.locales} id="locale-setting">
    {locales.map(({ locale, FlagComponent }) => (
      <FlagComponent
        key={locale}
        className={classNames(
          styles.locale,
          {
            [styles.selected]: value === locale
          }
        )}
        title={locale}
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
  onChange: (locale) => dispatch(changeLocale(locale))
});

export default connect(mapStateToProps, mapDispatchToProps)(LocaleSetting);
