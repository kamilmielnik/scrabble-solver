import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectMessage } from 'i18n/selectors';

const Message = ({ message }) => message;

Message.propTypes = {
  id: PropTypes.string.isRequired,
  locale: PropTypes.string,
  message: PropTypes.string,
  values: PropTypes.object
};

const mapStateToProps = (state, { id, locale, values }) => ({
  message: selectMessage(state, { id, locale, values })
});

export default connect(mapStateToProps)(Message);
