import striptags from 'striptags';

type Normalize = (definition: string) => string;

const EMPHASIS_TAGS = ['a', 'b', 'em', 'internalXref'];

const normalizeHtmlTags: Normalize = (definition) => striptags(striptags(definition, EMPHASIS_TAGS), undefined, '"');

const normalizeLineBreaks: Normalize = (definition) => definition.replace(/[\r\n]/g, '');

const normalizeQuotes: Normalize = (definition) => definition.replace(/\."/g, '".');

/**
 * `(1.2) definition` -> `definition`
 */
const normalizeMarkers: Normalize = (definition) => definition.replace(/^\(\d+\.\d+\)\s+/g, '');

const normalizeTrailingSymbols: Normalize = (definition) => definition.trim().replace(/:$/, '');

const normalizeLeadingSymbols: Normalize = (definition) => definition.trim().replace(/^:/, '');

const normalizeNonWords: Normalize = (definition) => (/\w/.test(definition) ? definition : '');

const normalizeCommas: Normalize = (definition) => {
  return definition
    .replace(/\s+,\s+/g, ', ')
    .replace(/^,/, '')
    .replace(/,$/, '');
};

const normalizers: Normalize[] = [
  normalizeHtmlTags,
  normalizeMarkers,
  normalizeQuotes,
  normalizeLineBreaks,
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
