import { type Result } from '@scrabble-solver/types';
import { type FocusEvent, type MouseEvent, type MouseEventHandler } from 'react';

export interface ResultCallbacks {
  onBlur?: (result: Result, event: FocusEvent) => void;
  onClick?: (result: Result, event: MouseEvent) => void;
  onFocus?: (result: Result, event: FocusEvent) => void;
  onMouseEnter?: (result: Result, event: MouseEvent) => void;
  onMouseLeave?: MouseEventHandler;
}

export interface ResultData extends Omit<ResultCallbacks, 'onMouseLeave'> {
  highlightedIndex?: number;
  results: Result[] | undefined;
}
