import React, { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Joyride from 'react-joyride';
import { hideWalkthrough } from 'walkthrough/state';
import { selectShowWalkthrough, selectSteps, selectTranslations } from 'walkthrough/selectors';
import 'react-joyride/lib/react-joyride-compiled.css';
import './styles.scss';
const JoyrideComponent = typeof Joyride.default === 'function' ? Joyride.default : Joyride;

class Walkthrough extends Component {
  static propTypes = {
    showWalkthrough: PropTypes.bool.isRequired,
    steps: PropTypes.array.isRequired,
    translations: PropTypes.object.isRequired,
    onFinished: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.joyride = createRef();
  }

  callback = ({ type }) => {
    if (type === 'finished') {
      this.joyride.current.reset(true);
      this.props.onFinished();
    }
  }

  render() {
    const { showWalkthrough, steps, translations } = this.props;

    return (
      <JoyrideComponent
        ref={this.joyride}
        locale={{
          back: (<span>{translations.back}</span>),
          close: (<span>{translations.close}</span>),
          last: (<span>{translations.last}</span>),
          next: (<span>{translations.next}</span>),
          skip: (<span>{translations.skip}</span>)
        }}
        autoStart={true}
        callback={this.callback}
        disableOverlay={true}
        holePadding={10}
        run={showWalkthrough}
        showOverlay={true}
        showSkipButton={true}
        showStepsProgress={true}
        steps={steps}
        type="continuous" />
    );
  }
}

const mapStateToProps = (state) => ({
  showWalkthrough: selectShowWalkthrough(state),
  steps: selectSteps(state),
  translations: selectTranslations(state)
});

const mapDispatchToProps = (dispatch) => ({
  onFinished: () => dispatch(hideWalkthrough())
});

export default connect(mapStateToProps, mapDispatchToProps)(Walkthrough);
