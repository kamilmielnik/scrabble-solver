import striptags from 'striptags';

type Normalize = (definition: string) => string;

const EMPHASIS_TAGS = ['a', 'b', 'em', 'internalXref'];

const normalizeHtmlTags: Normalize = (definition) => striptags(striptags(definition, EMPHASIS_TAGS), undefined, '"');

const normalizeLineBreaks: Normalize = (definition) => definition.replace(/\r\n/gu, '\n');

const normalizeWhitespace: Normalize = (definition) => definition.replace(/[^\S\n ]+/gu, ' ').replace(/[ ]+/gu, ' ');

const normalizeQuotes: Normalize = (definition) => definition.replace(/\."/gu, '".');

/**
 * `(1.2) definition` -> `definition`
 */
const normalizeMarkers: Normalize = (definition) => definition.replace(/^\(\d+\.\d+\)\s+/gu, '');

const normalizeTrailingSymbols: Normalize = (definition) => definition.trim().replace(/:$/u, '');

const normalizeLeadingSymbols: Normalize = (definition) => definition.trim().replace(/^:/u, '');

/**
 * @see https://stackoverflow.com/a/40732368
 */
const normalizeNonWords: Normalize = (definition) => (/[\w\u0621-\u064A]+/u.test(definition) ? definition : '');

const normalizeCommas: Normalize = (definition) => {
  return definition
    .replace(/\s+,\s+/gu, ', ')
    .replace(/^,/u, '')
    .replace(/,$/u, '');
};

const normalizers: Normalize[] = [
  normalizeHtmlTags,
  normalizeMarkers,
  normalizeQuotes,
  normalizeLineBreaks,
  normalizeWhitespace,
  normalizeTrailingSymbols,
  normalizeLeadingSymbols,
  normalizeNonWords,
  normalizeCommas,
  (definition) => definition.trim(),
];

const normalizeDefinition = (definition: string): string => {
  const normalized = normalizers.reduce((result, normalize) => normalize(result), definition);
  const hasChanged = normalized !== definition;
  return hasChanged ? normalizeDefinition(normalized) : normalized;
};

export default normalizeDefinition;
