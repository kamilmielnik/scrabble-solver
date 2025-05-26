import { type RemoveCellFilters } from 'types';

export const parseValue = (value: string): RemoveCellFilters => {
  if (value === 'always') {
    return 'always';
  }

  if (value === 'never') {
    return 'never';
  }

  throw new Error(`"${value}" is not valid. Should be "always" or "never"`);
};
