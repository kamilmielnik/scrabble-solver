import { Locale } from '@scrabble-solver/types';
import classNames from 'classnames';
import { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { Radio } from 'components';
import { LOCALE_FEATURES } from 'i18n';
import { selectLocale, settingsSlice, useTypedSelector } from 'state';

import styles from './LocaleSetting.module.scss';

interface Props {
  className?: string;
  disabled: boolean;
}

const OPTIONS = Object.values(LOCALE_FEATURES).sort((a, b) => a.name.localeCompare(b.name));

const LocaleSetting: FunctionComponent<Props> = ({ className, disabled }) => {
  const dispatch = useDispatch();
  const locale = useTypedSelector(selectLocale);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newLocale: Locale = event.target.value as Locale;
    dispatch(settingsSlice.actions.changeLocale(newLocale));
  };

  return (
    <div className={className}>
      {OPTIONS.map(({ Icon, ...option }) => (
        <Radio
          checked={locale === option.locale}
          className={classNames(styles.option, className, {
            [styles.checked]: locale === option.locale,
          })}
          disabled={disabled}
          key={option.locale}
          name="locale"
          value={option.locale}
          onChange={handleChange}
        >
          <span className={styles.label}>
            <Icon aria-hidden="true" className={styles.flag} role="img" />

            <span>{option.label}</span>
          </span>
        </Radio>
      ))}
    </div>
  );
};

export default LocaleSetting;
