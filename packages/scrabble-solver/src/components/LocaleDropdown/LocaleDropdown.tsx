import React, { FunctionComponent } from 'react';
import classNames from 'classnames';

import { Locale } from 'types';

import Dropdown from '../Dropdown';
import DropdownItem from '../DropdownItem';
import SvgIcon from '../SvgIcon';

import styles from './LocaleDropdown.module.scss';
import options from './options';

interface Props {
  className?: string;
  value: Locale;
  onChange: (locale: Locale) => void;
}

const LocaleDropdown: FunctionComponent<Props> = ({ className, value, onChange }) => {
  const selectedOption = options.find((option) => option.value === value);
  const availableOptions = options.filter((option) => option.value !== value);

  return (
    <div className={classNames(styles.localeDropdown, className)}>
      <div className={styles.trigger}>
        {selectedOption && (
          <>
            <SvgIcon className={classNames(styles.flag, selectedOption.className)} icon={selectedOption.icon} />{' '}
            {selectedOption.label}
          </>
        )}
      </div>

      <Dropdown className={styles.dropdown} dropLeft>
        {availableOptions.map((option) => (
          <DropdownItem key={option.value} onClick={() => onChange(option.value)}>
            <SvgIcon className={classNames(styles.flag, option.className)} icon={option.icon} /> {option.label}
          </DropdownItem>
        ))}
      </Dropdown>
    </div>
  );
};

export default LocaleDropdown;
