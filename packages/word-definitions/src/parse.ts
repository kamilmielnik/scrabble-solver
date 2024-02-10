import { Locale } from '@scrabble-solver/types';

import { english, french, german, persian, polish, romanian, spanish } from './languages';
import { normalizeDefinition, unique } from './lib';
import { ParsingResult } from './types';

const parsePerLocale: Record<Locale, (html: string) => ParsingResult> = {
  [Locale.DE_DE]: german.parse,
  [Locale.EN_GB]: english.parse,
  [Locale.EN_US]: english.parse,
  [Locale.ES_ES]: spanish.parse,
  [Locale.FA_IR]: persian.parse,
  [Locale.FR_FR]: french.parse,
  [Locale.PL_PL]: polish.parse,
  [Locale.RO_RO]: romanian.parse,
};

export const parse = (locale: Locale, html: string): ParsingResult => {
  const { definitions, exists } = parsePerLocale[locale](html);

  return {
    definitions: unique(definitions.map(normalizeDefinition).filter(Boolean)),
    exists,
  };
};
