import { MissingPage, Page, WiktionaryResponse } from './types';

const isObject = (value: any): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export const isMissingPage = (value: any): value is MissingPage => {
  return isObject(value) && typeof value.missing === 'string';
};

export const isPage = (value: any): value is Page => {
  return isObject(value) && typeof value.extract === 'string';
};

export const isPages = (value: any): value is WiktionaryResponse['query']['pages'] => {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value).every((value) => isPage(value) || isMissingPage(value))
  );
};

export const isQuery = (value: any): value is WiktionaryResponse['query'] => {
  return isObject(value.query) && isPages(value.query.pages);
};

export const isWarnings = (value: any): value is WiktionaryResponse['warnings'] => {
  return isObject(value) && isObject(value.extracts) && typeof value.extracts['*'] === 'string';
};

export const isWiktionaryResponse = (value: any): value is WiktionaryResponse => {
  return (
    isObject(value) && typeof value.batchcomplete === 'string' && isWarnings(value.warnings) && isQuery(value.query)
  );
};
