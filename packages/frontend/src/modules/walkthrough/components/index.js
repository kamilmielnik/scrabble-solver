import React, { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Joyride from 'react-joyride';

import { hideWalkthrough } from 'walkthrough/state';
import { selectShowWalkthrough, selectSteps, selectTranslations } from 'walkthrough/selectors';
import 'react-joyride/lib/react-joyride-compiled.css';
import './walkthrough.module.scss';

const JoyrideComponent = typeof Joyride.default === 'function' ? Joyride.default : Joyride;
const LOCAL_STORAGE_KEY = 'scrabble-solver-tutorial-shown';
const hasRunOnce = window.localStorage.getItem(LOCAL_STORAGE_KEY);

class Walkthrough extends Component {
  static propTypes = {
    showWalkthrough: PropTypes.bool.isRequired,
    steps: PropTypes.array.isRequired,
    translations: PropTypes.object.isRequired,
    onFinished: PropTypes.func.isRequired
  };

  joyride = createRef();

  state = {
    isTouched: false
  };

  callback = ({ type }) => {
    if (['beacon:before', 'finished'].includes(type)) {
      this.joyride.current.reset(true);
      this.props.onFinished();
    }
    this.setState({ isTouched: true });
  };

  render() {
    const { showWalkthrough, steps, translations } = this.props;
    const { isTouched } = this.state;

    return (
      <JoyrideComponent
        ref={this.joyride}
        locale={{
          back: <span>{translations.back}</span>,
          close: <span>{translations.close}</span>,
          last: <span>{translations.last}</span>,
          next: <span>{translations.next}</span>,
          skip: <span>{translations.skip}</span>
        }}
        autoStart={!hasRunOnce || isTouched}
        callback={this.callback}
        disableOverlay
        holePadding={10}
        run={showWalkthrough}
        showOverlay
        showSkipButton={false}
        showStepsProgress
        steps={steps}
        type="continuous"
      />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Walkthrough);
