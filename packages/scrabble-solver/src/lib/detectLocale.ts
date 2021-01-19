import { Locale } from 'types';

const detectLocale = (): Locale => {
  if (window.navigator.languages.includes('pl') || window.navigator.languages.includes('pl-PL')) {
    return 'pl-PL';
  }

  if (window.navigator.languages.includes('en-GB')) {
    return 'en-GB';
  }

  if (window.navigator.languages.includes('fr-FR')) {
    return 'fr-FR';
  }

  return 'en-US';
};

export default detectLocale;
