import variables from '@/styles/variables.module.scss';
import { ResultColumnId } from '@/types';

export const BREAKPOINTS = {
  xs: Number(variables.breakpointXs),
  s: Number(variables.breakpointS),
  m: Number(variables.breakpointM),
  l: Number(variables.breakpointL),
  xl: Number(variables.breakpointXl),
};

export const TRANSITION = 'var(--transition)';

export const GITHUB_PROJECT_URL = 'https://github.com/kamilmielnik/scrabble-solver';

export const TRANSITION_DURATION = Number(variables.transitionDuration);
export const TRANSITION_DURATION_LONG = Number(variables.transitionDurationLong);

export const COLOR_BLUE = variables.colorBlue;
export const COLOR_GREEN = variables.colorGreen;
export const COLOR_RED = variables.colorRed;
export const COLOR_YELLOW = variables.colorYellow;

export const COLOR_BONUS_CHARACTER_1 = variables.colorYellowLight;
export const COLOR_BONUS_CHARACTER_2 = variables.colorGreenLight;
export const COLOR_BONUS_CHARACTER_3 = variables.colorBlueLight;
export const COLOR_BONUS_CHARACTER_5 = variables.colorRedLight;
export const COLOR_BONUS_CHARACTER_MULTIPLIER_2 = variables.colorBonusCharacterMultiplier2;
export const COLOR_BONUS_CHARACTER_MULTIPLIER_3 = variables.colorBonusCharacterMultiplier3;
export const COLOR_BONUS_CHARACTER_MULTIPLIER_4 = variables.colorBonusCharacterMultiplier4;
export const COLOR_BONUS_START = variables.colorVioletLight;
export const COLOR_BONUS_WORD_MULTIPLIER_2 = variables.colorBonusWordMultiplier2;
export const COLOR_BONUS_WORD_MULTIPLIER_3 = variables.colorBonusWordMultiplier3;
export const COLOR_BONUS_WORD_MULTIPLIER_4 = variables.colorBonusWordMultiplier4;
export const COLOR_FILTERED = variables.colorForegroundSecondary;
export const COLOR_BACKGROUND = variables.colorBackground;

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

export const SPACING_XS = Number(variables.spacingXs);
export const SPACING_S = Number(variables.spacingS);
export const SPACING_M = Number(variables.spacingM);
export const SPACING_L = Number(variables.spacingL);
export const SPACING_XL = Number(variables.spacingXl);

export const COMPONENTS_SPACING = SPACING_XL;
export const COMPONENTS_SPACING_SMALL = SPACING_L;

export const RACK_TILE_SIZE_MAX = 80;

export const BOARD_CELL_ACTIONS_OFFSET = 3;
export const BOARD_CELL_BORDER_WIDTH = 1;
export const BOARD_TILE_FONT_SIZE_MIN = 14;
export const BOARD_TILE_FONT_SIZE_POINTS_MIN = 10;
export const BOARD_TILE_SIZE_MAX = RACK_TILE_SIZE_MAX;

export const BORDER_COLOR = variables.borderColor;
export const BORDER_COLOR_LIGHT = variables.borderColorLight;
export const BORDER_RADIUS = Number(variables.borderRadius);
export const BORDER_WIDTH = Number(variables.borderWidth);

export const BUTTON_ICON_SIZE = Number(variables.buttonIconSize);
export const BUTTON_PADDING_VERTICAL = SPACING_M;
export const BUTTON_HEIGHT = BUTTON_ICON_SIZE + 2 * BUTTON_PADDING_VERTICAL + 2 * BORDER_WIDTH;

export const DICTIONARY_HEIGHT = Number(variables.dictionaryHeight);
export const DICTIONARY_HEIGHT_MOBILE = Number(variables.dictionaryHeightMobile);

export const LOGO_ASPECT_RATIO = 682 / 166;
export const LOGO_HEIGHT = Number(variables.logoHeight);
export const LOGO_HEIGHT_SMALL = Number(variables.logoHeightSmall);
export const LOGO_SRC = '/logo.svg';

export const MODAL_WIDTH = Number(variables.modalWidth);
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

export const REMAINING_TILES_TILE_SIZE = 50;

export const RESULTS_COLUMN_WIDTH: Record<ResultColumnId, number | undefined> = {
  [ResultColumnId.BlanksCount]: 55,
  [ResultColumnId.ConsonantsCount]: 55,
  [ResultColumnId.Coordinates]: 55,
  [ResultColumnId.Points]: 80,
  [ResultColumnId.TilesCount]: 55,
  [ResultColumnId.VowelsCount]: 55,
  [ResultColumnId.Word]: undefined,
  [ResultColumnId.WordsCount]: 55,
};
export const RESULTS_ITEM_HEIGHT = Number(variables.resultsItemHeight);

export const RESULTS_HEADER_HEIGHT = RESULTS_ITEM_HEIGHT;

export const SOLVER_COLUMN_WIDTH = Number(variables.solverColumnWidth);

export const TEXT_INPUT_HEIGHT = Number(variables.textInputHeight);
