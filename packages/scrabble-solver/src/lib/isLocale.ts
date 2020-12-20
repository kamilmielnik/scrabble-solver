import { Locale } from 'types';

const isLocale = (locale: any): locale is Locale => {
  return ['en-GB', 'en-US', 'pl-PL'].includes(locale);
};

export default isLocale;
