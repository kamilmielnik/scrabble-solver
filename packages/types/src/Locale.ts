// eslint-disable-next-line no-shadow
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
