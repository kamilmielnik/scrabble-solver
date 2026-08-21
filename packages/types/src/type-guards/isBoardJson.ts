import { type BoardJson } from '../BoardJson';

import { isCellJson } from './isCellJson';

export const isBoardJson = (value: unknown): value is BoardJson => {
  if (!Array.isArray(value)) {
    return false;
  }

  for (const row of value) {
    if (!Array.isArray(row)) {
      return false;
    }

    for (const cell of row) {
      if (!isCellJson(cell)) {
        return false;
      }
    }
  }

  return true;
};
