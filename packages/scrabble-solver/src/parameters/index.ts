export const BREAKPOINTS = {
  xs: 480,
  s: 768,
  m: 992,
  l: 1200,
  xl: 1400,
};

export const EASE_OUT_CUBIC = 'cubic-bezier(0.33, 1, 0.68, 1)'; // https://easings.net/#easeOutCubic

export const GITHUB_PROJECT_URL = 'https://github.com/kamilmielnik/scrabble-solver';

export const INITIALIZATION_DURATION = 100;

export const TRANSITION_DURATION = 100;
export const TRANSITION_DURATION_LONG = 250;

export const COLOR_BLUE = '#c7d8f9';
export const COLOR_GREEN = '#bae3ba';
export const COLOR_RED = '#f7c2aa';
export const COLOR_YELLOW = '#efe3ae';

export const COMPONENTS_SPACING = 40;
export const COMPONENTS_SPACING_SMALL = 20;

export const BOARD_CELL_BORDER_WIDTH = 1;
export const BOARD_TILE_FONT_SIZE_MIN = 14;
export const BOARD_TILE_FONT_SIZE_POINTS_MIN = 10;
export const BOARD_TILE_SIZE_MAX = 64;
/**
 * 20 - fits all board tiles without horizontal scrollbar on 360px viewport width (font-size: 14px)
 * 21 - fits all board tiles without horizontal scrollbar on 375px viewport width (font-size: 14px)
 * 26 - tiles start to look good (font-size: 16px)
 */
export const BOARD_TILE_SIZE_MIN = 20;

export const BORDER_WIDTH = 1;

export const COLUMN_MIN_HEIGHT = 588.5;

export const DICTIONARY_HEIGHT = 260;

export const TILE_SIZE = 80;

export const PLAIN_TILES_COLOR_DEFAULT = COLOR_GREEN;
export const PLAIN_TILES_PADDING_HORIZONTAL = 0;
export const PLAIN_TILES_PADDING_VERTICAL = 0;
export const PLAIN_TILES_POINTS_COLORS: Record<number, string> = {
  1: COLOR_YELLOW,
  2: COLOR_GREEN,
  3: COLOR_BLUE,
  4: COLOR_RED,
  5: COLOR_RED,
  6: COLOR_RED,
  7: COLOR_RED,
  8: COLOR_RED,
  9: COLOR_RED,
  10: COLOR_RED,
};
export const PLAIN_TILES_TILE_MARGIN = 6;
export const PLAIN_TILES_TILE_MAX_ROTATE = 0;
export const PLAIN_TILES_TILE_MAX_SCATTER = 0;
export const PLAIN_TILES_TILE_SIZE = 80;
export const PLAIN_TILES_VERSION_TILE_COLOR = COLOR_GREEN;
export const PLAIN_TILES_VERSION_TILE_SIZE = TILE_SIZE;

export const PROGRESS_COLOR_VALUE = 'var(--color--violet--light)';
export const PROGRESS_COLOR_BACKGROUND = 'var(--color--inactive)';

export const RACK_TILE_SIZE_MAX = 80;

export const REMAINING_TILES_TILE_SIZE = 50;

export const RESULTS_HEADER_HEIGHT = 34;
export const RESULTS_ITEM_HEIGHT = 40;
export const RESULTS_INPUT_HEIGHT = 40;

export const TILE_APPEAR_DURATION = 200;
export const TILE_APPEAR_KEYFRAMES = [
  { opacity: 0.85, transform: 'scale(0.85)' },
  { opacity: 1, transform: 'scale(1)' },
];
