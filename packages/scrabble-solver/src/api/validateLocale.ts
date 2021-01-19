import { Locale } from '@scrabble-solver/types';

const locales = Object.values(Locale);

const validateLocale = (locale: unknown): void => {
  if (typeof locale !== 'string') {
    throw new Error('Invalid "locale" parameter: not a string');
  }

  if (!locales.includes(locale as Locale)) {
    throw new Error(`Invalid "locale" parameter: must be one of: ${locales.join(', ')}`);
  }
};

export default validateLocale;
