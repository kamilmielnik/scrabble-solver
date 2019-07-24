import { useSelector } from 'react-redux';

import { selectConfig, selectConfigId } from './selectors';

export const useConfig = () => useSelector(selectConfig);

export const useConfigId = () => useSelector(selectConfigId);
