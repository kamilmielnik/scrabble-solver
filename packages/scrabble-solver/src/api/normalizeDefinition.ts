import striptags from 'striptags';

const EMPHASIS_TAGS = ['a', 'em', 'b', 'internalXref'];

const normalizeDefinition = (definition: string): string => {
  return striptags(striptags(definition, EMPHASIS_TAGS), undefined, '"').replace(/\."/g, '".');
};

export default normalizeDefinition;
