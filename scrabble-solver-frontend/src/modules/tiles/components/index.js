import { connect } from 'react-redux';
import { changeInput, clearInput, submit } from 'tiles/state';
import { selectMessage } from 'i18n/selectors';
import { selectInput, selectInputLength } from 'tiles/selectors';
import Input from 'components/input';

const mapStateToProps = (state) => ({
  id: 'tiles',
  label: selectMessage(state, {
    id: 'modules.tiles.label',
    values: {
      numberOfTiles: selectInputLength(state)
    }
  }),
  value: selectInput(state)
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (event) => dispatch(changeInput(event.target.value)),
  onClear: () => dispatch(clearInput()),
  onSubmit: () => dispatch(submit())
});

export default connect(mapStateToProps, mapDispatchToProps)(Input);
