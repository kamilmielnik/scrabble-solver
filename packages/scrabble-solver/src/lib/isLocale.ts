import { Locale } from 'types';

const isLocale = (locale: unknown): locale is Locale => ['en-GB', 'en-US', 'pl-PL'].includes(locale);

export default isLocale;
