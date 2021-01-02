import i18n from 'i18n';
import { Locale } from 'types';

const i18nInitialState = {
  i18n,
  // TODO: use local storage to initialize the state based on last session
  locale: 'en-GB' as Locale,
};

export default i18nInitialState;
