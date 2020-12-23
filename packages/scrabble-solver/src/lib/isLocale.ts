import { Locale } from 'types';

const isLocale = (locale: unknown): locale is Locale => ['en-GB', 'en-US', 'pl-PL'].includes(locale as string);

export default isLocale;
