export type Comparator<T> = (a: T, B: T) => number;

export enum SortDirection {
  Ascending = 'ascending',
  Descending = 'descending',
}

export interface RemainingTile {
  character: string;
  count: number;
  score: number;
  usedCount: number;
}

export interface RemainingTilesGroup {
  remainingCount: number;
  tiles: RemainingTile[];
  translationKey: TranslationKey;
  totalCount: number;
}

export enum ResultColumn {
  BlanksCount = 'blanks-count',
  ConsonantsCount = 'consonants-count',
  Points = 'points',
  TilesCount = 'tiles-count',
  VowelsCount = 'vowels-count',
  Word = 'word',
  WordsCount = 'words-count',
}

export type TranslationKey =
  | 'cell.set-blank'
  | 'cell.set-not-blank'
  | 'cell.toggle-direction'
  | 'common.clear'
  | 'common.close'
  | 'common.loading'
  | 'common.blanks'
  | 'common.consonants'
  | 'common.points'
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
  | 'empty-state.error'
  | 'empty-state.info'
  | 'empty-state.success'
  | 'empty-state.warning'
  | 'github'
  | 'keyMap'
  | 'keyMap.board'
  | 'keyMap.board.toggle-blank'
  | 'keyMap.board.toggle-direction'
  | 'keyMap.board-and-rack'
  | 'keyMap.board-and-rack.insert-two-letter-tile'
  | 'keyMap.board-and-rack.navigate'
  | 'keyMap.board-and-rack.remove-tile'
  | 'keyMap.board-and-rack.submit'
  | 'keyMap.rack'
  | 'keyMap.rack.insert-blank'
  | 'rack.placeholder'
  | 'remaining-tiles'
  | 'results.empty-state.no-filtered-results'
  | 'results.empty-state.no-results'
  | 'results.empty-state.outdated'
  | 'results.empty-state.uninitialized'
  | 'results.input.placeholder'
  | 'results.solve'
  | 'settings'
  | 'settings.autoGroupTiles'
  | 'settings.autoGroupTiles.left'
  | 'settings.autoGroupTiles.right'
  | 'settings.autoGroupTiles.null'
  | 'settings.game'
  | 'settings.language';

export type Translate = (key: TranslationKey) => string;

export type Translations = Record<TranslationKey, string>;
