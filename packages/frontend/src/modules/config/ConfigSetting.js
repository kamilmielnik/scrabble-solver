import React from 'react';
import { useDispatch } from 'react-redux';
import * as configs from '@scrabble-solver/configs';

import Setting from 'components/setting';

import { useConfigId } from './hooks';
import { changeConfig } from './state';

const options = Object.values(configs).map(({ id, name }) => ({
  label: name,
  value: id
}));

const ConfigSetting = () => {
  const dispatch = useDispatch();
  const configId = useConfigId();

  return (
    <Setting
      id="config-setting"
      options={options}
      value={configId}
      onChange={(id) => dispatch(changeConfig(configs[id]))}
    />
  );
};

export default ConfigSetting;
