import { type BoardWord, type Result, type ShowCoordinates } from '@scrabble-solver/types';

export type Comparator<T> = (a: T, B: T) => number;

export type ComparatorFactory<T> = (locale: string, showCoordinates: ShowCoordinates) => Comparator<T>;

export type AutoGroupTiles = 'left' | 'right' | null;

export type CellFilterType = 'exclude' | 'include';

export type CellFilter = {
  x: Point['x'];
  y: Point['y'];
  type: CellFilterType;
};

export type RemoveCellFilters = 'always' | 'never' | null;

export { type Direction } from '@scrabble-solver/types';

export type InputMode = 'keyboard' | 'touchscreen';

export interface Point {
  x: number;
  y: number;
}

export type Rack = (string | null)[];

export interface Sort<Id extends string = ResultColumnId> {
  column: Id;
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

export enum WordColumnId {
  Coordinates = 'coordinates',
  Validity = 'validity',
  Word = 'word',
}

export interface GroupedResults {
  matching: Result[];
  other: Result[];
}

export interface GroupedWords {
  matching: VerifiedWord[];
  other: VerifiedWord[];
}

export interface VerifiedWord extends BoardWord {
  isValid: boolean;
}

export type TranslationKey =
  | 'boards.add'
  | 'boards.remove-confirm'
  | 'boards.remove'
  | 'boards.rename'
  | 'boards.tab'
  | 'boards'
  | 'cell.enter-word'
  | 'cell.filter-cell.exclude'
  | 'cell.filter-cell.include'
  | 'cell.set-blank'
  | 'cell.set-not-blank'
  | 'cell.tile.location'
  | 'cell.toggle-direction'
  | 'common.arrows'
  | 'common.blanks'
  | 'common.cancel'
  | 'common.clear'
  | 'common.close'
  | 'common.consonants'
  | 'common.loading'
  | 'common.next'
  | 'common.off'
  | 'common.on'
  | 'common.points'
  | 'common.previous'
  | 'common.remove'
  | 'common.space'
  | 'common.tiles'
  | 'common.two-letter-tiles'
  | 'common.vowels'
  | 'common.word'
  | 'common.words'
  | 'dictionary.empty-state.no-definitions'
  | 'dictionary.empty-state.no-results'
  | 'dictionary.empty-state.not-allowed'
  | 'dictionary.empty-state.uninitialized'
  | 'dictionary.input.placeholder'
  | 'dictionary.input.title'
  | 'dictionary'
  | 'empty-state.error'
  | 'empty-state.info'
  | 'empty-state.success'
  | 'empty-state.warning'
  | 'github'
  | 'keyMap.board-and-rack.insert-two-letter-tile'
  | 'keyMap.board-and-rack.navigate'
  | 'keyMap.board-and-rack.remove-tile'
  | 'keyMap.board-and-rack.submit'
  | 'keyMap.board-and-rack'
  | 'keyMap.board.toggle-blank'
  | 'keyMap.board.toggle-cell-filter'
  | 'keyMap.board.toggle-direction'
  | 'keyMap.board'
  | 'keyMap.rack.insert-blank'
  | 'keyMap.rack'
  | 'keyMap'
  | 'menu'
  | 'rack.placeholder'
  | 'rack.tile.location'
  | 'rack.touchscreen.placeholder'
  | 'remaining-tiles'
  | 'results.empty-state.no-results'
  | 'results.empty-state.outdated'
  | 'results.empty-state.uninitialized'
  | 'results.input.placeholder'
  | 'results.insert'
  | 'results.preview'
  | 'results.select'
  | 'results.solve'
  | 'results'
  | 'settings.autoGroupTiles.left'
  | 'settings.autoGroupTiles.null'
  | 'settings.autoGroupTiles.right'
  | 'settings.autoGroupTiles'
  | 'settings.game'
  | 'settings.highlightUnreachableCells'
  | 'settings.inputMode.keyboard'
  | 'settings.inputMode.touchscreen'
  | 'settings.inputMode'
  | 'settings.language'
  | 'settings.removeCellFilters.always'
  | 'settings.removeCellFilters.never'
  | 'settings.removeCellFilters'
  | 'settings.showCoordinates.alternative'
  | 'settings.showCoordinates.original'
  | 'settings.showCoordinates'
  | 'settings'
  | 'words.empty-state.no-words'
  | 'words.input.placeholder'
  | 'words.invalid'
  | 'words.preview'
  | 'words.valid'
  | 'words.validity'
  | 'words';

export type Translate = (key: TranslationKey, replacements?: Record<string, string>) => string;

export type Translations = Record<TranslationKey, string>;

export * from './api';
