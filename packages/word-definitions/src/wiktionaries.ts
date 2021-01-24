import { Locale, Wiktionary } from './types';

const wiktionaries: Record<Locale, Wiktionary> = {
  aa: {
    name: 'Afar',
    locale: 'aa',
  },
  ab: {
    name: 'Аҧсуа',
    locale: 'ab',
  },
  af: {
    name: 'Afrikaans',
    locale: 'af',
  },
  ak: {
    name: 'Akana',
    locale: 'ak',
  },
  am: {
    name: 'አማርኛ',
    locale: 'am',
  },
  an: {
    name: 'Aragonés',
    locale: 'an',
  },
  ang: {
    name: 'Englisc',
    locale: 'ang',
  },
  ar: {
    name: 'العربية',
    locale: 'ar',
  },
  as: {
    name: 'অসমীয়া',
    locale: 'as',
  },
  ast: {
    name: 'Asturianu',
    locale: 'ast',
  },
  av: {
    name: 'Авар',
    locale: 'av',
  },
  ay: {
    name: 'Aymar',
    locale: 'ay',
  },
  az: {
    name: 'Azərbaycanca',
    locale: 'az',
  },
  be: {
    name: 'Беларуская',
    locale: 'be',
  },
  bg: {
    name: 'Български',
    locale: 'bg',
  },
  bh: {
    name: 'भोजपुरी',
    locale: 'bh',
  },
  bi: {
    name: 'Bislama',
    locale: 'bi',
  },
  bm: {
    name: 'Bamanankan',
    locale: 'bm',
  },
  bn: {
    name: 'বাংলা',
    locale: 'bn',
  },
  bo: {
    name: 'བོད་སྐད',
    locale: 'bo',
  },
  br: {
    name: 'Brezhoneg',
    locale: 'br',
  },
  bs: {
    name: 'Bosanski',
    locale: 'bs',
  },
  ca: {
    name: 'Català',
    locale: 'ca',
  },
  ch: {
    name: 'Chamoru',
    locale: 'ch',
  },
  chr: {
    name: 'ᏣᎳᎩ',
    locale: 'chr',
  },
  co: {
    name: 'Corsu',
    locale: 'co',
  },
  cr: {
    name: 'Nehiyaw',
    locale: 'cr',
  },
  cs: {
    name: 'Čeština',
    locale: 'cs',
  },
  csb: {
    name: 'Kaszëbsczi',
    locale: 'csb',
  },
  cy: {
    name: 'Cymraeg',
    locale: 'cy',
  },
  da: {
    name: 'Dansk',
    locale: 'da',
  },
  de: {
    name: 'Deutsch',
    locale: 'de',
  },
  dv: {
    name: 'ދިވެހިބަސް',
    locale: 'dv',
  },
  dz: {
    name: 'ཇོང་ཁ',
    locale: 'dz',
  },
  el: {
    name: 'Ελληνικά',
    locale: 'el',
  },
  en: {
    name: 'English',
    locale: 'en',
  },
  eo: {
    name: 'Esperanto',
    locale: 'eo',
  },
  es: {
    name: 'Español',
    locale: 'es',
  },
  et: {
    name: 'Eesti',
    locale: 'et',
  },
  eu: {
    name: 'Euskara',
    locale: 'eu',
  },
  fa: {
    name: 'فارسی',
    locale: 'fa',
  },
  fi: {
    name: 'Suomi',
    locale: 'fi',
  },
  fj: {
    name: 'Na Vosa Vakaviti',
    locale: 'fj',
  },
  fo: {
    name: 'Føroyskt',
    locale: 'fo',
  },
  fr: {
    name: 'Français',
    locale: 'fr',
  },
  fy: {
    name: 'Frysk',
    locale: 'fy',
  },
  ga: {
    name: 'Gaeilge',
    locale: 'ga',
  },
  gd: {
    name: 'Gàidhlig',
    locale: 'gd',
  },
  gl: {
    name: 'Galego',
    locale: 'gl',
  },
  gn: {
    name: "Avañe'ẽ",
    locale: 'gn',
  },
  gu: {
    name: 'ગુજરાતી',
    locale: 'gu',
  },
  gv: {
    name: 'Gaelg',
    locale: 'gv',
  },
  ha: {
    name: 'Hausa',
    locale: 'ha',
  },
  he: {
    name: 'עברית',
    locale: 'he',
  },
  hi: {
    name: 'हिन्दी',
    locale: 'hi',
  },
  hif: {
    name: 'Fiji Hindi',
    locale: 'hif',
  },
  hr: {
    name: 'Hrvatski',
    locale: 'hr',
  },
  hsb: {
    name: 'Hornjoserbsce',
    locale: 'hsb',
  },
  hu: {
    name: 'Magyar',
    locale: 'hu',
  },
  hy: {
    name: 'Հայերեն',
    locale: 'hy',
  },
  ia: {
    name: 'Interlingua',
    locale: 'ia',
  },
  id: {
    name: 'Bahasa Indonesia',
    locale: 'id',
  },
  ie: {
    name: 'Interlingue',
    locale: 'ie',
  },
  ik: {
    name: 'Iñupiak',
    locale: 'ik',
  },
  io: {
    name: 'Ido',
    locale: 'io',
  },
  is: {
    name: 'Íslenska',
    locale: 'is',
  },
  it: {
    name: 'Italiano',
    locale: 'it',
  },
  iu: {
    name: 'ᐃᓄᒃᑎᑐᑦ',
    locale: 'iu',
  },
  ja: {
    name: '日本語',
    locale: 'ja',
  },
  jbo: {
    name: 'Lojban',
    locale: 'jbo',
  },
  jv: {
    name: 'Basa Jawa',
    locale: 'jv',
  },
  ka: {
    name: 'ქართული',
    locale: 'ka',
  },
  kk: {
    name: 'Қазақша',
    locale: 'kk',
  },
  kl: {
    name: 'Kalaallisut',
    locale: 'kl',
  },
  km: {
    name: 'ភាសាខ្មែរ',
    locale: 'km',
  },
  kn: {
    name: 'ಕನ್ನಡ',
    locale: 'kn',
  },
  ko: {
    name: '한국어',
    locale: 'ko',
  },
  ks: {
    name: 'कश्मीरी',
    locale: 'ks',
  },
  ku: {
    name: 'Kurdî',
    locale: 'ku',
  },
  kw: {
    name: 'Kernewek/Karnuack',
    locale: 'kw',
  },
  ky: {
    name: 'Кыргызча',
    locale: 'ky',
  },
  la: {
    name: 'Latina',
    locale: 'la',
  },
  lb: {
    name: 'Lëtzebuergesch',
    locale: 'lb',
  },
  li: {
    name: 'Limburgs',
    locale: 'li',
  },
  ln: {
    name: 'Lingala',
    locale: 'ln',
  },
  lo: {
    name: 'ລາວ',
    locale: 'lo',
  },
  lt: {
    name: 'Lietuvių',
    locale: 'lt',
  },
  lv: {
    name: 'Latviešu',
    locale: 'lv',
  },
  mg: {
    name: 'Malagasy',
    locale: 'mg',
  },
  mh: {
    name: 'Ebon',
    locale: 'mh',
  },
  mi: {
    name: 'Māori',
    locale: 'mi',
  },
  min: {
    name: 'Minangkabau',
    locale: 'min',
  },
  mk: {
    name: 'Македонски',
    locale: 'mk',
  },
  ml: {
    name: 'മലയാളം',
    locale: 'ml',
  },
  mn: {
    name: 'Монгол',
    locale: 'mn',
  },
  mr: {
    name: 'मराठी',
    locale: 'mr',
  },
  ms: {
    name: 'Bahasa Melayu',
    locale: 'ms',
  },
  mt: {
    name: 'Malti',
    locale: 'mt',
  },
  my: {
    name: 'မြန်မာဘာသာ',
    locale: 'my',
  },
  na: {
    name: 'dorerin Naoero',
    locale: 'na',
  },
  nah: {
    name: 'Nāhuatl',
    locale: 'nah',
  },
  nds: {
    name: 'Plattdüütsch',
    locale: 'nds',
  },
  ne: {
    name: 'नेपाली',
    locale: 'ne',
  },
  nl: {
    name: 'Nederlands',
    locale: 'nl',
  },
  nn: {
    name: 'Nynorsk',
    locale: 'nn',
  },
  no: {
    name: 'Norsk (Bokmål)',
    locale: 'no',
  },
  oc: {
    name: 'Occitan',
    locale: 'oc',
  },
  om: {
    name: 'Oromoo',
    locale: 'om',
  },
  or: {
    name: 'ଓଡ଼ିଆ',
    locale: 'or',
  },
  pa: {
    name: 'ਪੰਜਾਬੀ',
    locale: 'pa',
  },
  pi: {
    name: 'पाऴि',
    locale: 'pi',
  },
  pl: {
    name: 'Polski',
    locale: 'pl',
  },
  pnb: {
    name: 'شاہ مکھی پنجابی (Shāhmukhī Pañjābī)',
    locale: 'pnb',
  },
  ps: {
    name: 'پښتو',
    locale: 'ps',
  },
  pt: {
    name: 'Português',
    locale: 'pt',
  },
  qu: {
    name: 'Runa Simi',
    locale: 'qu',
  },
  rm: {
    name: 'Rumantsch',
    locale: 'rm',
  },
  rn: {
    name: 'Kirundi',
    locale: 'rn',
  },
  ro: {
    name: 'Română',
    locale: 'ro',
  },
  'roa-rup': {
    name: 'Armãneashce',
    locale: 'roa-rup',
  },
  ru: {
    name: 'Русский',
    locale: 'ru',
  },
  rw: {
    name: 'Ikinyarwanda',
    locale: 'rw',
  },
  sa: {
    name: 'संस्कृतम्',
    locale: 'sa',
  },
  sc: {
    name: 'Sardu',
    locale: 'sc',
  },
  scn: {
    name: 'Sicilianu',
    locale: 'scn',
  },
  sd: {
    name: 'سنڌي، سندھی ، सिन्ध',
    locale: 'sd',
  },
  sg: {
    name: 'Sängö',
    locale: 'sg',
  },
  sh: {
    name: 'Srpskohrvatski',
    locale: 'sh',
  },
  shy: {
    name: 'Tacawit',
    locale: 'shy',
  },
  si: {
    name: 'සිංහල',
    locale: 'si',
  },
  simple: {
    name: 'Simple English',
    locale: 'simple',
  },
  sk: {
    name: 'Slovenčina',
    locale: 'sk',
  },
  sl: {
    name: 'Slovenščina',
    locale: 'sl',
  },
  sm: {
    name: 'Gagana Samoa',
    locale: 'sm',
  },
  sn: {
    name: 'chiShona',
    locale: 'sn',
  },
  so: {
    name: 'Soomaali',
    locale: 'so',
  },
  sq: {
    name: 'Shqip',
    locale: 'sq',
  },
  sr: {
    name: 'Српски',
    locale: 'sr',
  },
  ss: {
    name: 'SiSwati',
    locale: 'ss',
  },
  st: {
    name: 'Sesotho',
    locale: 'st',
  },
  su: {
    name: 'Basa Sunda',
    locale: 'su',
  },
  sv: {
    name: 'Svenska',
    locale: 'sv',
  },
  sw: {
    name: 'Kiswahili',
    locale: 'sw',
  },
  ta: {
    name: 'தமிழ்',
    locale: 'ta',
  },
  te: {
    name: 'తెలుగు',
    locale: 'te',
  },
  tg: {
    name: 'Тоҷикӣ',
    locale: 'tg',
  },
  th: {
    name: 'ไทย',
    locale: 'th',
  },
  ti: {
    name: 'ትግርኛ',
    locale: 'ti',
  },
  tk: {
    name: 'Türkmen',
    locale: 'tk',
  },
  tl: {
    name: 'Tagalog',
    locale: 'tl',
  },
  tn: {
    name: 'Setswana',
    locale: 'tn',
  },
  to: {
    name: 'faka Tonga',
    locale: 'to',
  },
  tpi: {
    name: 'Tok Pisin',
    locale: 'tpi',
  },
  tr: {
    name: 'Türkçe',
    locale: 'tr',
  },
  ts: {
    name: 'Xitsonga',
    locale: 'ts',
  },
  tt: {
    name: 'Tatarça',
    locale: 'tt',
  },
  tw: {
    name: 'Twi',
    locale: 'tw',
  },
  ug: {
    name: 'ئۇيغۇر تىلى',
    locale: 'ug',
  },
  uk: {
    name: 'Українська',
    locale: 'uk',
  },
  ur: {
    name: 'اردو',
    locale: 'ur',
  },
  uz: {
    name: 'O‘zbek',
    locale: 'uz',
  },
  vec: {
    name: 'Vèneto',
    locale: 'vec',
  },
  vi: {
    name: 'Tiếng Việt',
    locale: 'vi',
  },
  vo: {
    name: 'Volapük',
    locale: 'vo',
  },
  wa: {
    name: 'Walon',
    locale: 'wa',
  },
  wo: {
    name: 'Wolof',
    locale: 'wo',
  },
  xh: {
    name: 'isiXhosa',
    locale: 'xh',
  },
  yi: {
    name: 'ייִדיש',
    locale: 'yi',
  },
  yo: {
    name: 'Yorùbá',
    locale: 'yo',
  },
  yue: {
    name: '粵語',
    locale: 'yue',
  },
  za: {
    name: 'Cuengh',
    locale: 'za',
  },
  zh: {
    name: '中文',
    locale: 'zh',
  },
  'zh-min-nan': {
    name: 'Bân-lâm-gú',
    locale: 'zh-min-nan',
  },
  zu: {
    name: 'isiZulu',
    locale: 'zu',
  },
};

export default wiktionaries;
