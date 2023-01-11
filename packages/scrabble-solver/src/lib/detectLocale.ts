import { Locale } from '@scrabble-solver/types';

const detectLocale = (): Locale => {
  if (window.navigator.languages.includes('pl') || window.navigator.languages.includes('pl-PL')) {
    return Locale.PL_PL;
  }

  if (window.navigator.languages.includes('en-GB')) {
    return Locale.EN_GB;
  }

  //TODO not sure if this is needed
  if (window.navigator.languages.includes('fa-FA')) {
    return Locale.FA_FA;
  }

  if (window.navigator.languages.includes('fr-FR')) {
    return Locale.FR_FR;
  }

  return Locale.EN_US;
};

export default detectLocale;
