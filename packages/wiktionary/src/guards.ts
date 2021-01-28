import { MissingPage, Page, WiktionaryResponse } from './types';

const isObject = (value: any): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export const isMissingPage = (value: any): value is MissingPage => {
  return (
    isObject(value) &&
    typeof value.missing === 'string' &&
    typeof value.ns === 'number' &&
    typeof value.title === 'string'
  );
};

export const isPage = (value: any): value is Page => {
  return (
    isObject(value) &&
    typeof value.extract === 'string' &&
    typeof value.ns === 'number' &&
    typeof value.pageid === 'number' &&
    typeof value.title === 'string'
  );
};

export const isPages = (value: any): value is WiktionaryResponse['query']['pages'] => {
  return isObject(value) && Object.values(value).every((value) => isPage(value) || isMissingPage(value));
};

export const isQuery = (value: any): value is WiktionaryResponse['query'] => {
  return isObject(value) && isPages(value.pages);
};

export const isWarnings = (value: any): value is WiktionaryResponse['warnings'] => {
  return (
    typeof value === 'undefined' ||
    (isObject(value) && isObject(value.extracts) && typeof value.extracts['*'] === 'string')
  );
};

export const isWiktionaryResponse = (value: any): value is WiktionaryResponse => {
  return (
    isObject(value) && typeof value.batchcomplete === 'string' && isWarnings(value.warnings) && isQuery(value.query)
  );
};
