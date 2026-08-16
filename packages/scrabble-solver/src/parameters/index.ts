import variables from '@/styles/variables.module.scss';

export const BREAKPOINTS = {
  xs: Number(variables.breakpointXs),
  s: Number(variables.breakpointS),
  m: Number(variables.breakpointM),
  l: Number(variables.breakpointL),
  xl: Number(variables.breakpointXl),
};

export const GITHUB_PROJECT_URL = 'https://github.com/kamilmielnik/scrabble-solver';

// Must match the class name in global.scss
export const CONFIG_PENDING_CLASS = 'config-pending';

export const TRANSITION_DURATION_LONG = Number(variables.transitionDurationLong);

export const COLOR_BLUE = 'var(--color--blue)';
export const COLOR_GREEN = 'var(--color--green)';
export const COLOR_RED = 'var(--color--red)';
export const COLOR_YELLOW = 'var(--color--yellow)';

export const COLOR_BACKGROUND = variables.colorBackground;
export const COLOR_BONUS_START = variables.colorVioletLight;

export const COLOR_BONUS_CHARACTER: Record<number, string> = {
  1: variables.colorYellowLight,
  2: variables.colorGreenLight,
  3: variables.colorBlueLight,
  5: variables.colorRedLight,
};

export const COLOR_BONUS_CHARACTER_MULTIPLIER: Record<number, string> = {
  2: variables.colorBonusCharacterMultiplier2,
  3: variables.colorBonusCharacterMultiplier3,
  4: variables.colorBonusCharacterMultiplier4,
};

export const COLOR_BONUS_WORD: Record<number, string> = {
  2: variables.colorBonusWordMultiplier2,
  3: variables.colorBonusWordMultiplier3,
  4: variables.colorBonusWordMultiplier4,
};

export const BOARD_CELL_ACTIONS_OFFSET = 3;

export const BORDER_COLOR_LIGHT = variables.borderColorLight;
export const BORDER_WIDTH = Number(variables.borderWidth);

export const LOGO_HEIGHT = 166;
export const LOGO_SRC = '/logo.svg';
export const LOGO_WIDTH = 682;

export const TOOLTIP_DURATION = Number(variables.transitionDuration);

export const PLAIN_TILES_COLOR_DEFAULT = COLOR_GREEN;
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
export const PLAIN_TILES_TILE_SIZE = 80;

export const RESULTS_ITEM_HEIGHT = Number(variables.resultsItemHeight);

export const RESULTS_OVERSCAN_COUNT = 10;
