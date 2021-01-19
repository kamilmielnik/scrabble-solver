import { Locale } from '@scrabble-solver/types';

const locales = Object.values(Locale);

const isLocale = (locale: unknown): locale is Locale => locales.includes(locale as Locale);

export default isLocale;
