import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { changeInput, clearInput, submit } from 'tiles/state';
import { selectInput, selectInputLength } from 'tiles/selectors';
import Input from 'components/input';

const mapStateToProps = (state, { intl }) => ({
  label: intl.formatMessage({ id: 'modules.tiles.label' }, {
    numberOfTiles: String(selectInputLength(state))
  }),
  value: selectInput(state)
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (event) => dispatch(changeInput(event.target.value)),
  onClear: () => dispatch(clearInput()),
  onSubmit: () => dispatch(submit())
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Input));
