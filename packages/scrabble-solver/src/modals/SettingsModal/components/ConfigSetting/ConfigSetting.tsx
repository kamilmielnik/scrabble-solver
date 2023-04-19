import { games, hasConfig } from '@scrabble-solver/configs';
import { isGame } from '@scrabble-solver/types';
import { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { Radio } from 'components';
import { selectGame, selectLocale, settingsSlice, useTypedSelector } from 'state';

import styles from './ConfigSetting.module.scss';

interface Props {
  className?: string;
  disabled?: boolean;
}

const ConfigSetting: FunctionComponent<Props> = ({ className, disabled }) => {
  const dispatch = useDispatch();
  const game = useTypedSelector(selectGame);
  const locale = useTypedSelector(selectLocale);
  const options = Object.values(games).map((gameConfig) => ({
    disabled: !hasConfig(gameConfig.game, locale),
    label: gameConfig.name,
    value: gameConfig.game,
  }));

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

export default ConfigSetting;
