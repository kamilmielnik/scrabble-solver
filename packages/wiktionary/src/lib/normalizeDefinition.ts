import striptags from 'striptags';

type Normalize = (definition: string) => string;

const EMPHASIS_TAGS = ['a', 'em', 'b', 'internalXref'];

const normalizers: Normalize[] = [
  (definition) => striptags(definition, EMPHASIS_TAGS),
  (definition) => striptags(definition, undefined, '"'),
  (definition) => definition.replace(/\."/g, '".'),
  (definition) => definition.replace(/[\r\n]/g, ''),
  (definition) => definition.trim(),
];

const normalizeDefinition = (definition: string): string => {
  return normalizers.reduce((result, normalize) => normalize(result), definition);
};

export default normalizeDefinition;
