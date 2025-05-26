import { type Result } from '@scrabble-solver/types';
import { type FunctionComponent, type SVGAttributes } from 'react';

export type Comparator<T> = (a: T, B: T) => number;

export type AutoGroupTiles = 'left' | 'right' | null;

export type CellFilterType = 'include' | 'exclude';

export type CellFilter = {
  x: Point['x'];
  y: Point['y'];
  type: CellFilterType;
};

export type RemoveCellFilters = 'always' | 'never' | null;

export type Direction = 'horizontal' | 'vertical';

export type InputMode = 'keyboard' | 'touchscreen';

export interface Point {
  x: number;
  y: number;
}

export type Rack = (string | null)[];

export interface Sort {
  column: ResultColumnId;
  direction: SortDirection;
}

export enum SortDirection {
  Ascending = 'ascending',
  Descending = 'descending',
}

export interface RemainingTile {
  character: string;
  count?: number;
  score: number;
  usedCount: number;
}

export interface RemainingTilesGroup {
  remainingCount: number;
  tiles: RemainingTile[];
  translationKey: TranslationKey;
  totalCount: number;
}

export enum ResultColumnId {
  BlanksCount = 'blanks-count',
  ConsonantsCount = 'consonants-count',
  Coordinates = 'coordinates',
  Points = 'points',
  TilesCount = 'tiles-count',
  VowelsCount = 'vowels-count',
  Word = 'word',
  WordsCount = 'words-count',
}

export interface ResultColumn {
  className: string;
  Icon?: FunctionComponent<SVGAttributes<SVGElement>>;
  id: ResultColumnId;
  translationKey: TranslationKey;
  width?: number;
}

export interface GroupedResults {
  matching: Result[];
  other: Result[];
}

export type TranslationKey =
  | 'cell.enter-word'
  | 'cell.filter-cell.exclude'
  | 'cell.filter-cell.include'
  | 'cell.set-blank'
  | 'cell.set-not-blank'
  | 'cell.tile.location'
  | 'cell.toggle-direction'
  | 'common.arrows'
  | 'common.clear'
  | 'common.close'
  | 'common.loading'
  | 'common.blanks'
  | 'common.consonants'
  | 'common.next'
  | 'common.points'
  | 'common.previous'
  | 'common.space'
  | 'common.tiles'
  | 'common.two-letter-tiles'
  | 'common.vowels'
  | 'common.word'
  | 'common.words'
  | 'dictionary'
  | 'dictionary.empty-state.no-definitions'
  | 'dictionary.empty-state.no-results'
  | 'dictionary.empty-state.not-allowed'
  | 'dictionary.empty-state.uninitialized'
  | 'dictionary.input.placeholder'
  | 'dictionary.input.title'
  | 'empty-state.error'
  | 'empty-state.info'
  | 'empty-state.success'
  | 'empty-state.warning'
  | 'github'
  | 'keyMap'
  | 'keyMap.board'
  | 'keyMap.board.toggle-blank'
  | 'keyMap.board.toggle-cell-filter'
  | 'keyMap.board.toggle-direction'
  | 'keyMap.board-and-rack'
  | 'keyMap.board-and-rack.insert-two-letter-tile'
  | 'keyMap.board-and-rack.navigate'
  | 'keyMap.board-and-rack.remove-tile'
  | 'keyMap.board-and-rack.submit'
  | 'keyMap.rack'
  | 'keyMap.rack.insert-blank'
  | 'menu'
  | 'rack.placeholder'
  | 'rack.tile.location'
  | 'rack.touchscreen.placeholder'
  | 'remaining-tiles'
  | 'results'
  | 'results.empty-state.no-results'
  | 'results.empty-state.outdated'
  | 'results.empty-state.uninitialized'
  | 'results.input.placeholder'
  | 'results.insert'
  | 'results.preview'
  | 'results.solve'
  | 'settings'
  | 'settings.autoGroupTiles'
  | 'settings.autoGroupTiles.left'
  | 'settings.autoGroupTiles.right'
  | 'settings.autoGroupTiles.null'
  | 'settings.game'
  | 'settings.inputMode'
  | 'settings.inputMode.keyboard'
  | 'settings.inputMode.touchscreen'
  | 'settings.removeCellFilters'
  | 'settings.removeCellFilters.always'
  | 'settings.removeCellFilters.never'
  | 'settings.language'
  | 'settings.showCoordinates'
  | 'settings.showCoordinates.alternative'
  | 'settings.showCoordinates.hidden'
  | 'settings.showCoordinates.original'
  | 'words'
  | 'words.invalid'
  | 'words.valid';

export type Translate = (key: TranslationKey, replacements?: Record<string, string>) => string;

export type Translations = Record<TranslationKey, string>;

export * from './api';
