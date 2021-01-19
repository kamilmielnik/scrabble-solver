import { Locale } from 'types';

const locales: Locale[] = ['en-GB', 'en-US', 'fr-FR', 'pl-PL'];

const validateLocale = (locale: unknown): void => {
  if (typeof locale !== 'string') {
    throw new Error('Invalid "locale" parameter: not a string');
  }

  if (!locales.includes(locale as Locale)) {
    throw new Error(`Invalid "locale" parameter: must be one of: ${locales.join(', ')}`);
  }
};

export default validateLocale;
