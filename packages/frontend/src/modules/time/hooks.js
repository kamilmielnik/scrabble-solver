import { useSelector } from 'react-redux';

import { selectTime } from './selectors';

export const useTime = () => useSelector(selectTime);
