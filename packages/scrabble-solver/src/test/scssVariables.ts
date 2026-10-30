/**
 * The SCSS loader stub cannot run Sass, so without these the `:export` block of variables.module.scss resolves to its
 * own key names and every number in `parameters/` becomes NaN.
 */
export const scssVariables = {
  borderColorLight: '#d9d9d9',
  borderWidth: '1',
  breakpointL: '1200',
  breakpointM: '992',
  breakpointS: '768',
  breakpointXl: '1400',
  breakpointXs: '480',
  colorBackground: '#f4f4f4',
  colorBlueLight: '#dde4f6',
  colorBonusCharacterMultiplier2: '#b8d5ed',
  colorBonusCharacterMultiplier3: '#86aed1',
  colorBonusCharacterMultiplier4: '#3477b2',
  colorBonusWordMultiplier2: '#fbc997',
  colorBonusWordMultiplier3: '#f19393',
  colorBonusWordMultiplier4: '#ed5e5e',
  colorGreenLight: '#d6ebd6',
  colorRedLight: '#fbe0d4',
  colorVioletLight: '#b284b8',
  colorYellowLight: '#f7f1d6',
  resultsItemHeight: '40',
  transitionDuration: '100',
  transitionDurationLong: '250',
};
