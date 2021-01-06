import i18n from 'i18n';
import { detectLocale } from 'lib';

const i18nInitialState = {
  i18n,
  locale: detectLocale(),
};

export default i18nInitialState;
