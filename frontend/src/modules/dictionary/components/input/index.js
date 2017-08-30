import { connect } from 'react-redux';
import { changeInput, clearInput, submit } from 'dictionary/state';
import { selectInput } from 'dictionary/selectors';
import Input from 'components/input';

const mapStateToProps = (state) => ({
  label: state.intl.messages['modules.dictionary.input.label'],
  value: selectInput(state)
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (event) => dispatch(changeInput(event.target.value)),
  onClear: () => dispatch(clearInput()),
  onSubmit: () => dispatch(submit())
});

export default connect(mapStateToProps, mapDispatchToProps)(Input);
