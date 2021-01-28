import { Extracts, MissingPage, Page, Pages, Query, Warnings, WiktionaryResponse } from './types';

const isObject = (value: any): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export const isQuery = (value: any): value is Query => {
  return isObject(value) && isPages(value.pages);
};

export const isPages = (value: any): value is Pages => {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.entries(value).every(([key, value]) => {
      return typeof key === 'string' && (isPage(value) || isMissingPage(value));
    })
  );
};

export const isExtracts = (value: any): value is Extracts => {
  return isObject(value) && typeof value['*'] === 'string';
};

export const isWarnings = (value: any): value is Warnings => {
  return isObject(value) && isExtracts(value.extracts);
};

export const isPage = (value: any): value is Page => {
  return isObject(value) && typeof value.extract === 'string';
};

export const isMissingPage = (value: any): value is MissingPage => {
  return isObject(value) && typeof value.missing === 'string';
};

export const isWiktionaryResponse = (value: any): value is WiktionaryResponse => {
  return (
    isObject(value) && typeof value.batchcomplete === 'string' && isWarnings(value.warnings) && isQuery(value.query)
  );
};
