import PropTypes from 'prop-types';

import { useMessage } from './hooks';

const Message = ({ id, locale, values }) => useMessage({ id, locale, values });

Message.propTypes = {
  id: PropTypes.string.isRequired,
  locale: PropTypes.string,
  values: PropTypes.object
};

export default Message;
