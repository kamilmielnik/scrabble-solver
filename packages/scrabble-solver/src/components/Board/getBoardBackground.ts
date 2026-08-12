import { BONUS_WORD } from '@scrabble-solver/constants';
import { type Bonus, type Config, type ShowCoordinates, type TextDirection } from '@scrabble-solver/types';

import { BORDER_COLOR_LIGHT, BORDER_WIDTH, COLOR_BACKGROUND, COLOR_BONUS_START } from '@/parameters';
import { type Point } from '@/types';

import { getBonusColor } from './lib';

interface BoardBackgroundOptions {
  config: Config;
  direction: TextDirection;
  showCoordinates: ShowCoordinates;
}

interface Frame {
  width: number;
  height: number;
  coordinatesSize: number;
  direction: TextDirection;
}

interface BonusesOptions {
  config: Config;
  getX: (point: Point) => number;
  getY: (point: Point) => number;
}

const CELL_SIZE = 80;
const COORDINATES_SIZE = CELL_SIZE / 2;
const BORDER_RADIUS = CELL_SIZE * 0.1;
const BONUS_SIZE = CELL_SIZE * 0.8;
const BONUS_OFFSET = CELL_SIZE * 0.1;
const ICON_SIZE = CELL_SIZE * 0.4;
const ICON_OFFSET = (CELL_SIZE - ICON_SIZE) / 2;
const FONT_SIZE = CELL_SIZE * 0.6 * 0.6;
const FONT_OFFSET = CELL_SIZE / 2;
const GRID_LINE_SIZE = 1;

const BONUS_SYMBOL_ID = 'b';
const BONUS_X2_SYMBOL_ID = 'b2';
const BONUS_X3_SYMBOL_ID = 'b3';
const BONUS_X4_SYMBOL_ID = 'b4';

// https://icons.getbootstrap.com/icons/star-fill/
const STAR_PATH =
  'M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z';

const cache = new WeakMap<Config, Map<string, string>>();

export function getBoardBackground({ config, direction, showCoordinates }: BoardBackgroundOptions): string {
  const key = `${showCoordinates}|${direction}`;
  const cached = cache.get(config)?.get(key);

  if (cached) {
    return cached;
  }

  const dataUrl = `data:image/svg+xml,${encodeURIComponent(buildSvg({ config, direction, showCoordinates }))}`;
  const byVariant = cache.get(config) ?? new Map<string, string>();
  byVariant.set(key, dataUrl);
  cache.set(config, byVariant);

  return dataUrl;
}

function buildSvg({ config, direction, showCoordinates }: BoardBackgroundOptions): string {
  const coordinatesSize = showCoordinates === 'hidden' ? 0 : COORDINATES_SIZE;
  const coordinatesExtra = coordinatesSize === 0 ? 0 : coordinatesSize + BORDER_WIDTH;
  const width = (CELL_SIZE + BORDER_WIDTH) * config.boardWidth + BORDER_WIDTH + coordinatesExtra;
  const height = (CELL_SIZE + BORDER_WIDTH) * config.boardHeight + BORDER_WIDTH + coordinatesExtra;
  const getX = (point: Point) => (direction === 'ltr' ? coordinatesSize : 0) + point.x * (CELL_SIZE + BORDER_WIDTH);
  const getY = (point: Point) => coordinatesSize + point.y * (CELL_SIZE + BORDER_WIDTH);
  const center = { x: Math.floor(config.boardWidth / 2), y: Math.floor(config.boardHeight / 2) };

  const frame: Frame = { coordinatesSize, direction, height, width };

  return [
    `<svg height="${height}" viewBox="0 0 ${width} ${height}" width="${width}" xmlns="http://www.w3.org/2000/svg">`,
    buildDefs(),
    buildBackground(frame),
    buildGridLines(config, frame),
    buildBonuses({ config, getX, getY }),
    buildStartCell(getX(center), getY(center)),
    '</svg>',
  ].join('');
}

function buildDefs(): string {
  const bonusRect = `<rect height="${BONUS_SIZE}" rx="${BORDER_RADIUS}" width="${BONUS_SIZE}" x="${BONUS_OFFSET}" y="${BONUS_OFFSET}"/>`;

  return [
    '<defs>',
    `<symbol id="${BONUS_SYMBOL_ID}">${bonusRect}</symbol>`,
    `<symbol id="${BONUS_X2_SYMBOL_ID}">${bonusRect}${multiplierText(2)}</symbol>`,
    `<symbol id="${BONUS_X3_SYMBOL_ID}">${bonusRect}${multiplierText(3)}</symbol>`,
    `<symbol id="${BONUS_X4_SYMBOL_ID}">${bonusRect}${multiplierText(4)}</symbol>`,
    '</defs>',
  ].join('');
}

function multiplierText(multiplier: number): string {
  return `<text dominant-baseline="central" fill="white" font-family="system-ui, sans-serif" font-size="${FONT_SIZE}" font-weight="bold" text-anchor="middle" x="${FONT_OFFSET}" y="${FONT_OFFSET}">×${multiplier}</text>`;
}

function buildBackground({ coordinatesSize, direction, height, width }: Frame): string {
  if (coordinatesSize === 0) {
    return `<rect fill="white" height="${height}" rx="${BORDER_RADIUS}" width="${width}" x="0" y="0"/>`;
  }

  const cellsX = direction === 'ltr' ? coordinatesSize : 0;
  const coordinatesColumnX = direction === 'ltr' ? 0 : width - coordinatesSize;

  return [
    `<rect fill="${COLOR_BACKGROUND}" height="${height}" rx="${BORDER_RADIUS}" width="${width}" x="0" y="0"/>`,
    `<rect fill="white" height="${height - coordinatesSize}" width="${width - coordinatesSize}" x="${cellsX}" y="${coordinatesSize}"/>`,
    `<rect fill="${COLOR_BACKGROUND}" height="${coordinatesSize}" rx="${BORDER_RADIUS}" width="${width}" x="0" y="0"/>`,
    `<rect fill="${COLOR_BACKGROUND}" height="${height}" rx="${BORDER_RADIUS}" width="${coordinatesSize}" x="${coordinatesColumnX}" y="0"/>`,
  ].join('');
}

function buildGridLines(config: Config, { coordinatesSize, direction, height, width }: Frame): string {
  const lines: string[] = [];

  if (coordinatesSize > 0) {
    lines.push(horizontalLine(coordinatesSize - BORDER_WIDTH / 2, width));
    lines.push(
      verticalLine(
        direction === 'ltr' ? coordinatesSize - BORDER_WIDTH / 2 : width - coordinatesSize - BORDER_WIDTH / 2,
        height,
      ),
    );
  }

  for (let index = 1; index < config.boardHeight; ++index) {
    lines.push(horizontalLine(coordinatesSize + index * (CELL_SIZE + BORDER_WIDTH) - BORDER_WIDTH / 2, width));
  }

  const cellsX = direction === 'ltr' ? coordinatesSize : 0;

  for (let index = 1; index < config.boardWidth; ++index) {
    lines.push(verticalLine(cellsX + index * (CELL_SIZE + BORDER_WIDTH) - BORDER_WIDTH / 2, height));
  }

  return lines.join('');
}

function horizontalLine(y: number, width: number): string {
  return `<line stroke="${BORDER_COLOR_LIGHT}" stroke-width="${GRID_LINE_SIZE}" vector-effect="non-scaling-stroke" x1="0" x2="${width}" y1="${y}" y2="${y}"/>`;
}

function verticalLine(x: number, height: number): string {
  return `<line stroke="${BORDER_COLOR_LIGHT}" stroke-width="${GRID_LINE_SIZE}" vector-effect="non-scaling-stroke" x1="${x}" x2="${x}" y1="0" y2="${height}"/>`;
}

function buildBonuses({ config, getX, getY }: BonusesOptions): string {
  return config.bonuses
    .map(
      (bonus) =>
        `<use fill="${getBonusColor(bonus)}" href="#${getSymbolId(bonus)}" x="${getX(bonus)}" y="${getY(bonus)}"/>`,
    )
    .join('');
}

function getSymbolId(bonus: Bonus): string {
  if (bonus.type !== BONUS_WORD) {
    return BONUS_SYMBOL_ID;
  }

  switch (bonus.multiplier) {
    case 2:
      return BONUS_X2_SYMBOL_ID;
    case 3:
      return BONUS_X3_SYMBOL_ID;
    case 4:
      return BONUS_X4_SYMBOL_ID;
    default:
      return BONUS_SYMBOL_ID;
  }
}

function buildStartCell(x: number, y: number): string {
  return [
    `<rect fill="${COLOR_BONUS_START}" height="${BONUS_SIZE}" rx="${BORDER_RADIUS}" width="${BONUS_SIZE}" x="${x + BONUS_OFFSET}" y="${y + BONUS_OFFSET}"/>`,
    `<svg height="${ICON_SIZE}" viewBox="0 0 16 16" width="${ICON_SIZE}" x="${x + ICON_OFFSET}" y="${y + ICON_OFFSET}"><path d="${STAR_PATH}" fill="white"/></svg>`,
  ].join('');
}
