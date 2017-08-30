import { connect } from 'react-redux';
import { updateIntl } from 'react-intl-redux';
import * as intl from 'intl';
import { selectLocale } from 'config/selectors';
import Setting from 'components/setting';

const options = Object.values(intl).map(({ locale }) => ({
  label: locale,
  value: locale
}));

const mapStateToProps = (state) => ({
  label: state.intl.messages['modules.config.locale'],
  options,
  value: selectLocale(state)
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (locale) => dispatch(updateIntl(intl[locale]))
});

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
