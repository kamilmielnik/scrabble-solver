import classNames from 'classnames';
import fs from 'fs';
import path from 'path';
import { AnimationEvent, FunctionComponent, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useDispatch } from 'react-redux';
import { useEffectOnce, useMeasure } from 'react-use';

import { Logo, LogoSplashScreen, NavButtons, Solver, SvgFontFix } from 'components';
import { useDirection, useLanguage, useLocalStorage } from 'hooks';
import { LOCALE_FEATURES } from 'i18n';
import { KeyMapModal, MenuModal, RemainingTilesModal, ResultsModal, SettingsModal, WordsModal } from 'modals';
import { INITIALIZATION_DURATION } from 'parameters';
import { registerServiceWorker } from 'serviceWorkerManager';
import { initialize, localStorage, reset, selectLocale, useTypedSelector } from 'state';

import styles from './index.module.scss';

ReactModal.setAppElement('#__next');

interface Props {
  version: string;
}

// eslint-disable-next-line max-statements
const Index: FunctionComponent<Props> = ({ version }) => {
  const dispatch = useDispatch();
  const locale = useTypedSelector(selectLocale);
  const [showKeyMap, setShowKeyMap] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showRemainingTiles, setShowRemainingTiles] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWords, setShowWords] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [indexRef, { height: indexHeight, width: indexWidth }] = useMeasure<HTMLDivElement>();
  const [navRef, { height: navHeight }] = useMeasure<HTMLDivElement>();
  const solverHeight = indexHeight - navHeight;
  const solverWidth = indexWidth;

  const handleClear = () => {
    dispatch(reset());
  };

  const handleSplashAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !localStorage.getHasVisited()) {
      setShowSettings(true);
      localStorage.setHasVisited(true);
    }
  };

  useDirection(LOCALE_FEATURES[locale].direction);
  useLanguage(locale);
  useLocalStorage();

  useEffectOnce(() => {
    dispatch(initialize());

    globalThis.setTimeout(() => {
      setIsInitialized(true);
    }, INITIALIZATION_DURATION);
  });

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      registerServiceWorker();
    }
  }, []);

  return (
    <>
      <SvgFontFix />

      <div className={classNames(styles.index, { [styles.initialized]: isInitialized })} ref={indexRef}>
        <div className={styles.nav} ref={navRef}>
          <div className={styles.navContent}>
            <div className={styles.navLogo}>
              <a className={styles.logoContainer} href="/" title={version}>
                <Logo className={styles.logo} />
              </a>
            </div>

            <NavButtons
              onClear={handleClear}
              onShowKeyMap={() => setShowKeyMap(true)}
              onShowMenu={() => setShowMenu(true)}
              onShowRemainingTiles={() => setShowRemainingTiles(true)}
              onShowSettings={() => setShowSettings(true)}
              onShowWords={() => setShowWords(true)}
            />
          </div>
        </div>

        <Solver
          className={styles.solver}
          height={solverHeight}
          width={solverWidth}
          onShowResults={() => setShowResults(true)}
        />
      </div>

      <MenuModal
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        onShowRemainingTiles={() => setShowRemainingTiles(true)}
        onShowSettings={() => setShowSettings(true)}
        onShowWords={() => setShowWords(true)}
      />

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      <KeyMapModal isOpen={showKeyMap} onClose={() => setShowKeyMap(false)} />

      <WordsModal isOpen={showWords} onClose={() => setShowWords(false)} />

      <RemainingTilesModal isOpen={showRemainingTiles} onClose={() => setShowRemainingTiles(false)} />

      <ResultsModal isOpen={showResults} onClose={() => setShowResults(false)} />

      <LogoSplashScreen forceShow={!isInitialized} onAnimationEnd={handleSplashAnimationEnd} />
    </>
  );
};

export const getStaticProps = async (): Promise<{ props: Props }> => {
  const version = await readVersion();
  return { props: { version } };
};

const readVersion = async (): Promise<string> => {
  const packageJsonFilepath = path.resolve(process.cwd(), 'package.json');
  const data = await fs.promises.readFile(packageJsonFilepath, 'utf-8');
  const packageJson = JSON.parse(data);
  return `v${packageJson.version}`;
};

export default Index;
