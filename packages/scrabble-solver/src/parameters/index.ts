export const BREAKPOINTS = {
  xs: 480,
  s: 768,
  m: 992,
  l: 1200,
  xl: 1400,
};

export const TRANSITION = 'var(--transition)';

export const GITHUB_PROJECT_URL = 'https://github.com/kamilmielnik/scrabble-solver';

export const TRANSITION_DURATION = 100;
export const TRANSITION_DURATION_LONG = 250;

export const COLOR_BLUE = '#c7d8f9';
export const COLOR_GREEN = '#bae3ba';
export const COLOR_RED = '#f7c2aa';
export const COLOR_YELLOW = '#efe3ae';

export const COLOR_BONUS_CHARACTER_1 = '#f7f1d6';
export const COLOR_BONUS_CHARACTER_2 = '#d6ebd6';
export const COLOR_BONUS_CHARACTER_3 = '#dde4f6';
export const COLOR_BONUS_CHARACTER_5 = '#fbe0d4';
export const COLOR_BONUS_CHARACTER_MULTIPLIER_2 = '#b8d5ed';
export const COLOR_BONUS_CHARACTER_MULTIPLIER_3 = '#86aed1';
export const COLOR_BONUS_CHARACTER_MULTIPLIER_4 = '#3477b2';
export const COLOR_BONUS_START = '#b284b8';
export const COLOR_BONUS_WORD_MULTIPLIER_2 = '#fbc997';
export const COLOR_BONUS_WORD_MULTIPLIER_3 = '#f19393';
export const COLOR_BONUS_WORD_MULTIPLIER_4 = '#ed5e5e';
export const COLOR_FILTERED = '#444';
export const COLOR_BACKGROUND = '#f4f4f4';

export const COLOR_BONUS_CHARACTER: Record<number, string> = {
  1: COLOR_BONUS_CHARACTER_1,
  2: COLOR_BONUS_CHARACTER_2,
  3: COLOR_BONUS_CHARACTER_3,
  5: COLOR_BONUS_CHARACTER_5,
};

export const COLOR_BONUS_CHARACTER_MULTIPLIER: Record<number, string> = {
  2: COLOR_BONUS_CHARACTER_MULTIPLIER_2,
  3: COLOR_BONUS_CHARACTER_MULTIPLIER_3,
  4: COLOR_BONUS_CHARACTER_MULTIPLIER_4,
};

export const COLOR_BONUS_WORD: Record<number, string> = {
  2: COLOR_BONUS_WORD_MULTIPLIER_2,
  3: COLOR_BONUS_WORD_MULTIPLIER_3,
  4: COLOR_BONUS_WORD_MULTIPLIER_4,
};

export const SPACING_XS = 2;
export const SPACING_S = 5;
export const SPACING_M = 10;
export const SPACING_L = 20;
export const SPACING_XL = 40;

export const COMPONENTS_SPACING = SPACING_XL;
export const COMPONENTS_SPACING_SMALL = SPACING_L;

export const BOARD_CELL_ACTIONS_OFFSET = 3;
export const BOARD_CELL_BORDER_WIDTH = 1;
export const BOARD_TILE_FONT_SIZE_MIN = 14;
export const BOARD_TILE_FONT_SIZE_POINTS_MIN = 10;
export const BOARD_TILE_SIZE_MAX = 64;

export const BORDER_COLOR = '#cdcdcd';
export const BORDER_COLOR_LIGHT = '#d9d9d9';
export const BORDER_RADIUS = 5;
export const BORDER_WIDTH = 1;

export const BUTTON_ICON_SIZE = 24;
export const BUTTON_PADDING_VERTICAL = SPACING_M;
export const BUTTON_HEIGHT = BUTTON_ICON_SIZE + 2 * BUTTON_PADDING_VERTICAL + 2 * BORDER_WIDTH;

export const DICTIONARY_HEIGHT = 260;
export const DICTIONARY_HEIGHT_MOBILE = 110;

export const LOGO_ASPECT_RATIO = 682 / 166;
export const LOGO_HEIGHT = 60;
export const LOGO_HEIGHT_SMALL = 48;
export const LOGO_SRC = '/logo.svg';

export const MODAL_WIDTH = 370;
export const MODAL_HEADER_HEIGHT = 45;

export const NAV_PADDING = SPACING_L;

export const TILE_SIZE = 80;
export const TOOLTIP_DURATION = TRANSITION_DURATION;

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

export const RESULTS_ITEM_HEIGHT = 40;

export const RESULTS_HEADER_HEIGHT = RESULTS_ITEM_HEIGHT;

export const SOLVER_COLUMN_WIDTH = 580;

export const TEXT_INPUT_HEIGHT = 40;
