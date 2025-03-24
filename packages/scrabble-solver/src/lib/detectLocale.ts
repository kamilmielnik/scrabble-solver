import { Locale } from '@scrabble-solver/types';

export const detectLocale = (): Locale => {
  const languages = window.navigator.languages;

  if (languages.includes('pl') || languages.includes('pl-PL')) {
    return Locale.PL_PL;
  }

  if (languages.includes('en-GB')) {
    return Locale.EN_GB;
  }

  if (languages.includes('fa') || languages.includes('fa-IR')) {
    return Locale.FA_IR;
  }

  if (languages.includes('fr-FR')) {
    return Locale.FR_FR;
  }

  if (languages.includes('ro') || languages.includes('ro-RO')) {
    return Locale.RO_RO;
  }

  return Locale.EN_US;
};
