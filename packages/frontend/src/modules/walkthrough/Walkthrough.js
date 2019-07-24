import React, { useCallback, useRef, useState } from 'react';
import Joyride from 'react-joyride';
import 'react-joyride/lib/react-joyride-compiled.css';

import { useHideWalkthrough, useShowWalkthrough, useSteps, useTranslations } from './hooks';
import './Walkthrough.module.scss';

const JoyrideComponent = typeof Joyride.default === 'function' ? Joyride.default : Joyride;
const LOCAL_STORAGE_KEY = 'scrabble-solver-tutorial-shown';
const hasRunOnce = window.localStorage.getItem(LOCAL_STORAGE_KEY);

const Walkthrough = () => {
  const ref = useRef(null);
  const showWalkthrough = useShowWalkthrough();
  const steps = useSteps();
  const translations = useTranslations();
  const [touched, setTouched] = useState(false);
  const hideWalkthrough = useHideWalkthrough();
  const callback = useCallback(
    ({ type }) => {
      if (['beacon:before', 'finished'].includes(type)) {
        ref.current.reset(true);
        hideWalkthrough();
      }
      setTouched(true);
    },
    [hideWalkthrough, ref]
  );

  return (
    <JoyrideComponent
      ref={ref}
      locale={{
        back: <span>{translations.back}</span>,
        close: <span>{translations.close}</span>,
        last: <span>{translations.last}</span>,
        next: <span>{translations.next}</span>,
        skip: <span>{translations.skip}</span>
      }}
      autoStart={!hasRunOnce || touched}
      callback={callback}
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
};

export default Walkthrough;
