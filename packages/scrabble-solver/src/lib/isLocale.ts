import { Locale } from 'types';

const isLocale = (locale: unknown): locale is Locale => ['en-GB', 'en-US', 'pl-PL', 'fr-FR'].includes(locale as string);

export default isLocale;
