import type { Result } from '@scrabble-solver/types';
import type { FocusEvent, MouseEvent } from 'react';

import type { ResultColumn, TranslationKey } from 'types';

export interface Column {
  className: string;
  id: ResultColumn;
  translationKey: TranslationKey;
}

export interface ResultCallbacks {
  onBlur?: (result: Result, event: FocusEvent) => void;
  onClick?: (result: Result, event: MouseEvent) => void;
  onFocus?: (result: Result, event: FocusEvent) => void;
  onMouseEnter?: (result: Result, event: MouseEvent) => void;
  onMouseLeave?: (result: Result, event: MouseEvent) => void;
}

export interface ResultData extends ResultCallbacks {
  highlightedIndex?: number;
  results: Result[] | undefined;
}
