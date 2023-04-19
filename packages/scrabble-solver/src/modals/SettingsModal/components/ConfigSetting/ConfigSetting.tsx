import { games, hasConfig } from '@scrabble-solver/configs';
import { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { Radio } from 'components';
import { selectConfigId, selectLocale, settingsSlice, useTypedSelector } from 'state';

import styles from './ConfigSetting.module.scss';

interface Props {
  className?: string;
  disabled?: boolean;
}

const ConfigSetting: FunctionComponent<Props> = ({ className, disabled }) => {
  const dispatch = useDispatch();
  const configId = useTypedSelector(selectConfigId);
  const locale = useTypedSelector(selectLocale);
  const options = Object.values(games).map((game) => ({
    disabled: !hasConfig(game.id, locale),
    label: game.name,
    value: game.id,
  }));

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(settingsSlice.actions.changeConfigId(event.target.value));
  };

  return (
    <div className={className}>
      {options.map((option) => (
        <Radio
          checked={configId === option.value}
          className={styles.option}
          disabled={disabled || option.disabled}
          key={option.value}
          name="configId"
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
