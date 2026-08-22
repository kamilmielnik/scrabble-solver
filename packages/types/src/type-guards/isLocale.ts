import { Locale } from '../Locale';

const locales = Object.values(Locale);

export const isLocale = (locale: unknown): locale is Locale => locales.includes(locale as Locale);
