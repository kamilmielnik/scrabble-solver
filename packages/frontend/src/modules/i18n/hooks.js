import { useSelector } from 'react-redux';

import { formatMessage } from 'i18n/utils';

import { selectMessages } from './selectors';

export const useMessage = ({ id, values }) => {
  const messages = useSelector(selectMessages);
  return formatMessage(messages[id], values);
};
