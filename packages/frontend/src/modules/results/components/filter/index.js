import { connect } from 'react-redux';

import { changeFilter, clearFilter } from 'results/state';
import { selectFilter, selectNumberOfFilteredResults, selectNumberOfResults } from 'results/selectors';
import { selectMessage } from 'i18n/selectors';
import Input from 'components/input';

const mapStateToProps = (state) => ({
  id: 'results-filter',
  label: selectMessage(state, {
    id: 'modules.results.filter.label',
    values: {
      numberOfResults: selectNumberOfFilteredResults(state),
      totalNumberOfResults: selectNumberOfResults(state)
    }
  }),
  value: selectFilter(state)
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (event) => dispatch(changeFilter(event.target.value)),
  onClear: () => dispatch(clearFilter()),
  onSubmit: () => dispatch(clearFilter())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Input);
