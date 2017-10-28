import { connect } from 'react-redux';
import * as configs from 'scrabble-solver-commons/configs';
import { changeConfig } from 'config/state';
import { selectConfigId } from 'config/selectors';
import { selectMessage } from 'i18n/selectors';
import Setting from 'components/setting';

const options = Object.values(configs).map(({ id, name }) => ({
  label: name,
  value: id
}));

const mapStateToProps = (state) => ({
  label: selectMessage(state, { id: 'modules.config.config' }),
  options,
  value: selectConfigId(state)
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (id) => dispatch(changeConfig(configs[id]))
});

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
