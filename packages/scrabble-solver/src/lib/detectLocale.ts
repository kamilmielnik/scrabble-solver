import { Locale } from '@scrabble-solver/types';

const detectLocale = (): Locale => {
  if (window.navigator.languages.includes('pl') || window.navigator.languages.includes('pl-PL')) {
    return Locale.plPl;
  }

  if (window.navigator.languages.includes('en-GB')) {
    return Locale.enGb;
  }

  if (window.navigator.languages.includes('fr-FR')) {
    return Locale.frFr;
  }

  return Locale.enUs;
};

export default detectLocale;
