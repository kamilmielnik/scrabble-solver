import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import {
  selectFilter,
  selectNumberOfFilteredResults,
  selectNumberOfResults
} from 'results/selectors';
import { changeFilter, clearFilter } from 'results/state';
import Input from 'components/input';

const mapStateToProps = (state, { intl }) => ({
  label: intl.formatMessage({ id: 'modules.results.filter.label' }, {
    numberOfResults: String(selectNumberOfFilteredResults(state)),
    totalNumberOfResults: String(selectNumberOfResults(state))
  }),
  value: selectFilter(state)
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (event) => dispatch(changeFilter(event.target.value)),
  onClear: () => dispatch(clearFilter()),
  onSubmit: () => dispatch(clearFilter())
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Input));
