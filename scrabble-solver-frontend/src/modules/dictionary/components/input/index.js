import { connect } from 'react-redux';
import { changeInput, clearInput, submit } from 'dictionary/state';
import { selectInput } from 'dictionary/selectors';
import { selectMessage } from 'i18n/selectors';
import Input from 'components/input';

const mapStateToProps = (state) => ({
  id: 'dictionary-find',
  label: selectMessage(state, { id: 'modules.dictionary.input.label' }),
  value: selectInput(state)
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (event) => dispatch(changeInput(event.target.value)),
  onClear: () => dispatch(clearInput()),
  onSubmit: () => dispatch(submit())
});

export default connect(mapStateToProps, mapDispatchToProps)(Input);
