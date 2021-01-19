import { Locale } from 'types';

const isLocale = (locale: unknown): locale is Locale => ['en-GB', 'en-US', 'fr-FR', 'pl-PL'].includes(locale as string);

export default isLocale;
