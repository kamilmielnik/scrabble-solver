import { isGame } from '@scrabble-solver/types';
import { ChangeEvent, FunctionComponent, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Radio } from 'components';
import { selectGame, selectLocale, settingsSlice, useTypedSelector } from 'state';

import styles from './ConfigSetting.module.scss';
import { getOptions } from './lib';

interface Props {
  className?: string;
  disabled?: boolean;
}

export const ConfigSetting: FunctionComponent<Props> = ({ className, disabled }) => {
  const dispatch = useDispatch();
  const game = useTypedSelector(selectGame);
  const locale = useTypedSelector(selectLocale);
  const options = useMemo(() => getOptions(locale), [locale]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isGame(event.target.value)) {
      dispatch(settingsSlice.actions.changeGame(event.target.value));
    }
  };

  return (
    <div className={className}>
      {options.map((option) => (
        <Radio
          checked={game === option.value}
          className={styles.option}
          disabled={disabled || option.disabled}
          key={option.value}
          name="game"
          value={option.value}
          onChange={handleChange}
        >
          <div className={styles.label}>{option.label}</div>
        </Radio>
      ))}
    </div>
  );
};
