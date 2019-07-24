import React from 'react';
import * as configs from '@scrabble-solver/configs';

import Setting from 'components/setting';

import { useChangeConfig, useConfigId } from './hooks';

const options = Object.values(configs).map(({ id, name }) => ({
  label: name,
  value: id
}));

const ConfigSetting = () => {
  const changeConfig = useChangeConfig();
  const configId = useConfigId();

  return (
    <Setting id="config-setting" options={options} value={configId} onChange={(id) => changeConfig(configs[id])} />
  );
};

export default ConfigSetting;
