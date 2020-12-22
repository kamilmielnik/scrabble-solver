import { Locale } from 'types';

const isLocale = (locale: any): locale is Locale => ['en-GB', 'en-US', 'pl-PL'].includes(locale);

export default isLocale;
