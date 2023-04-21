/**
 * Locales are defined using IETF language tags
 * @see https://en.wikipedia.org/wiki/IETF_language_tag
 * @see https://en.wikipedia.org/wiki/ISO_3166-1
 */
enum Locale {
  DE_DE = 'de-DE',
  EN_GB = 'en-GB',
  EN_US = 'en-US',
  ES_ES = 'es-ES',
  FA_IR = 'fa-IR',
  FR_FR = 'fr-FR',
  PL_PL = 'pl-PL',
}

const locales = Object.values(Locale);

export const isLocale = (locale: unknown): locale is Locale => locales.includes(locale as Locale);

export default Locale;
