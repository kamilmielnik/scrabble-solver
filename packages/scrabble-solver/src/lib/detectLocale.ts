import { Locale } from 'types';

const detectLocale = (): Locale => {
  if (window.navigator.languages.includes('pl') || window.navigator.languages.includes('pl-PL')) {
    return 'pl-PL';
  }

  if (window.navigator.languages.includes('en-GB')) {
    return 'en-GB';
  }

  return 'en-US';
};

export default detectLocale;
