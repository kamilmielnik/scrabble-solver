import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectMessage } from 'i18n/selectors';
import { formatMessage } from 'i18n/utils';

const Message = ({ message, values }) => formatMessage(message, values);

Message.propTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.node,
  values: PropTypes.object
};

const mapStateToProps = (state, { id }) => ({
  message: selectMessage(state, { id })
});

export default connect(mapStateToProps)(Message);
