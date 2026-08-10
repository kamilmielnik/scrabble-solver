/**
 * Regenerates screencast.gif by replaying the oxyphenbutazone scenario in a real browser.
 * Requires the app running at BASE_URL (default http://localhost:3333) - `bun run screencast` boots it.
 */
import { type BrowserContext, chromium, type Locator, type Page } from '@playwright/test';
import { Board } from '@scrabble-solver/types';
import { execFileSync } from 'node:child_process';
import { linkSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface Point {
  x: number;
  y: number;
}

interface CapturedFrame {
  file: string;
  timestamp: number;
}

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3333';
const LOCALE = 'en-GB';
const WIDTH = 1680;
const HEIGHT = 1233;
const CAPTURE_SCALE = 2;
const FPS = 15;
const RACK = 'oypbaze';
const TARGET_WORD = 'oxyphenbutazone';
const DEFINITIONS_TO_PLACEMENT_DELAY = 1200;
const DEFINITIONS_REQUEST_DELAY = 1000;
const CURSOR_START: Point = { x: 1478, y: 1154 };
const OUTPUT_FILE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'screencast.gif');

await recordScreencast();

async function recordScreencast(): Promise<void> {
  await ensureAppIsRunning();
  await warmUpDictionary();

  const framesDirectory = mkdtempSync(path.join(os.tmpdir(), 'screencast-'));
  const browser = await chromium.launch({ args: ['--force-color-profile=srgb'] });

  try {
    const context = await browser.newContext({
      deviceScaleFactor: CAPTURE_SCALE,
      locale: LOCALE,
      serviceWorkers: 'block',
      viewport: { height: HEIGHT, width: WIDTH },
    });
    await seedBoard(context);
    await seedSettings(context);
    await delayDefinitionRequests(context);
    await installCursor(context);

    const page = await context.newPage();
    await preparePage(page);

    const capture = await startCapture(page, framesDirectory);
    await playScenario(page);
    const endTimestamp = await capture.stop();
    await browser.close();

    const gifFramesDirectory = resampleFrames(capture.frames, endTimestamp, framesDirectory);
    encodeGif(gifFramesDirectory, OUTPUT_FILE);
    console.log(`Captured ${capture.frames.length} frames, wrote ${OUTPUT_FILE}`);
  } finally {
    await browser.close();
    rmSync(framesDirectory, { force: true, recursive: true });
  }
}

async function ensureAppIsRunning(): Promise<void> {
  try {
    await fetch(BASE_URL);
  } catch {
    throw new Error(`App is not running at ${BASE_URL} - run "bun run screencast" or start it with "bun start:app"`);
  }
}

async function warmUpDictionary(): Promise<void> {
  await fetch(new URL(`/api/dictionary/${LOCALE}`, BASE_URL));
}

async function seedBoard(context: BrowserContext): Promise<void> {
  await context.addInitScript((serializedBoard: string) => {
    window.localStorage.setItem('scrabble-solver.board', JSON.stringify(serializedBoard));
  }, JSON.stringify(createBoard().toJson()));
}

async function seedSettings(context: BrowserContext): Promise<void> {
  await context.addInitScript((locale: string) => {
    window.localStorage.setItem('scrabble-solver.settings', JSON.stringify({ locale }));
  }, LOCALE);
}

/**
 * Definitions on localhost load faster than a viewer can read - a latency floor keeps
 * fly-over rows from rendering their definitions and makes the loading state visible.
 */
async function delayDefinitionRequests(context: BrowserContext): Promise<void> {
  await context.route('**/api/dictionary/*/*', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, DEFINITIONS_REQUEST_DELAY));
    await route.continue().catch(() => undefined);
  });
}

function createBoard(): Board {
  const board = Board.fromStringArray([
    ' x  hen ut  on ',
    'puer  or amas j',
    'a led  a  er  a',
    'c ki   i elf  c',
    'i snot n  is  u',
    'f  t o w do   l',
    'y  e moa er   a',
    'i  r   solar  t',
    'n  v   h  t   i',
    'g  i   i bitten',
    '   e   n  v   g',
    '   w   g  e    ',
    '   e           ',
    '   d           ',
    '               ',
  ]);

  board.rows[4][3].tile.isBlank = true;
  board.rows[9][11].tile.isBlank = true;

  return board;
}

async function installCursor(context: BrowserContext): Promise<void> {
  await context.addInitScript(`(${showFakeCursor.toString()})(${CURSOR_START.x}, ${CURSOR_START.y})`);
}

function showFakeCursor(startX: number, startY: number): void {
  const cursor = document.createElement('div');
  cursor.style.cssText = 'position:fixed;top:0;left:0;z-index:2147483647;pointer-events:none;will-change:transform;';
  cursor.innerHTML =
    '<svg width="21" height="24" viewBox="0 0 14 16" xmlns="http://www.w3.org/2000/svg">' +
    '<polygon points="0.5,0.5 0.5,12.4 3.4,9.7 5.2,14 7.3,13.1 5.5,8.9 9.4,8.7" ' +
    'fill="#000" stroke="#fff" stroke-width="0.8" stroke-linejoin="round"/></svg>';
  cursor.style.transform = `translate(${startX}px, ${startY}px)`;

  document.addEventListener(
    'mousemove',
    (event) => {
      cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    },
    true,
  );

  function mount(): void {
    document.documentElement.appendChild(cursor);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
}

async function preparePage(page: Page): Promise<void> {
  await page.goto(BASE_URL);
  await page.getByTestId('board').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.getByTestId('rack').getByRole('textbox').first().focus();
  await page.mouse.move(CURSOR_START.x, CURSOR_START.y);
  await page.waitForTimeout(500);
}

async function playScenario(page: Page): Promise<void> {
  await page.waitForTimeout(700);
  await page.keyboard.type(RACK, { delay: 160 });
  await page.waitForTimeout(300);
  await page.keyboard.press('Enter');
  await waitForResults(page);
  await page.waitForTimeout(400);

  const topRowBox = await boxOf(page.getByTestId('results').getByTestId('result').first());
  const hoverX = topRowBox.x + topRowBox.width * 0.8;
  const topRowY = topRowBox.y + topRowBox.height / 2;

  const cursor = await glide(page, CURSOR_START, { x: hoverX, y: topRowY }, 1800);

  await waitForDefinitions(page, TARGET_WORD);
  await page.waitForTimeout(DEFINITIONS_TO_PLACEMENT_DELAY);
  await page.mouse.click(cursor.x, cursor.y, { delay: 60 });
  await waitForPlacement(page);
  await page.waitForTimeout(1600);
}

function waitForResults(page: Page): Promise<unknown> {
  return page.waitForFunction(
    () => {
      const container = document.querySelector('[data-testid="results"]');
      return (
        container?.getAttribute('data-outdated') === 'false' &&
        container.querySelector('[data-testid="result"]') !== null &&
        container.querySelector('[data-testid="loading"]') === null
      );
    },
    undefined,
    { timeout: 90_000 },
  );
}

function waitForDefinitions(page: Page, word: string): Promise<unknown> {
  return page.waitForFunction(
    (expectedWord: string) => {
      const dictionary = document.querySelector('[data-testid="dictionary"]');
      const title = dictionary?.querySelector('h2');
      return (
        title?.textContent?.toLowerCase() === expectedWord &&
        dictionary?.querySelector('[data-testid="loading"]') === null
      );
    },
    word,
    { timeout: 90_000 },
  );
}

function waitForPlacement(page: Page): Promise<unknown> {
  return page.waitForFunction(() => {
    const inputs = document.querySelectorAll<HTMLInputElement>('[data-testid="rack"] input');
    return inputs.length > 0 && [...inputs].every((input) => input.value === '');
  });
}

async function glide(page: Page, from: Point, to: Point, durationMs: number): Promise<Point> {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);

  if (distance === 0) {
    return to;
  }

  const bow = Math.min(40, distance * 0.12);
  const normal = { x: -(to.y - from.y) / distance, y: (to.x - from.x) / distance };
  const control = {
    x: (from.x + to.x) / 2 + normal.x * bow,
    y: (from.y + to.y) / 2 + normal.y * bow,
  };
  const steps = Math.max(2, Math.round(durationMs / (1000 / 60)));

  for (let step = 1; step <= steps; ++step) {
    const progress = easeInOutCubic(step / steps);
    const inverse = 1 - progress;
    const x = inverse * inverse * from.x + 2 * inverse * progress * control.x + progress * progress * to.x;
    const y = inverse * inverse * from.y + 2 * inverse * progress * control.y + progress * progress * to.y;
    await page.mouse.move(x, y);
    await page.waitForTimeout(durationMs / steps);
  }

  return to;
}

function easeInOutCubic(progress: number): number {
  return progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
}

async function boxOf(locator: Locator): Promise<{ height: number; width: number; x: number; y: number }> {
  const box = await locator.boundingBox();

  if (!box) {
    throw new Error(`Cannot measure ${String(locator)}`);
  }

  return box;
}

async function startCapture(
  page: Page,
  directory: string,
): Promise<{ frames: CapturedFrame[]; stop: () => Promise<number> }> {
  const client = await page.context().newCDPSession(page);
  const frames: CapturedFrame[] = [];

  client.on('Page.screencastFrame', (frame) => {
    const file = path.join(directory, `capture-${String(frames.length).padStart(5, '0')}.png`);
    writeFileSync(file, Buffer.from(frame.data, 'base64'));
    frames.push({ file, timestamp: frame.metadata.timestamp ?? Date.now() / 1000 });
    client.send('Page.screencastFrameAck', { sessionId: frame.sessionId }).catch(() => undefined);
  });

  await client.send('Page.startScreencast', {
    everyNthFrame: 1,
    format: 'png',
    maxHeight: HEIGHT * CAPTURE_SCALE,
    maxWidth: WIDTH * CAPTURE_SCALE,
  });

  return {
    frames,
    stop: async (): Promise<number> => {
      await client.send('Page.stopScreencast');
      await client.detach();
      return Date.now() / 1000;
    },
  };
}

function resampleFrames(frames: CapturedFrame[], endTimestamp: number, framesDirectory: string): string {
  if (frames.length === 0) {
    throw new Error('No frames captured');
  }

  const gifFramesDirectory = path.join(framesDirectory, 'gif');
  mkdirSync(gifFramesDirectory);

  const startTimestamp = frames[0].timestamp;
  const frameCount = Math.max(1, Math.ceil((endTimestamp - startTimestamp) * FPS));
  let sourceIndex = 0;

  for (let index = 0; index < frameCount; ++index) {
    const tickTimestamp = startTimestamp + index / FPS;

    while (sourceIndex + 1 < frames.length && frames[sourceIndex + 1].timestamp <= tickTimestamp) {
      ++sourceIndex;
    }

    linkSync(frames[sourceIndex].file, path.join(gifFramesDirectory, `frame-${String(index).padStart(5, '0')}.png`));
  }

  return gifFramesDirectory;
}

function encodeGif(framesDirectory: string, outputFile: string): void {
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-framerate',
      String(FPS),
      '-i',
      path.join(framesDirectory, 'frame-%05d.png'),
      '-vf',
      `scale=${WIDTH}:${HEIGHT}:flags=lanczos,unsharp=5:5:0.8,split[a][b];[a]palettegen[palette];[b][palette]paletteuse=dither=sierra2_4a:diff_mode=rectangle`,
      '-loop',
      '0',
      outputFile,
    ],
    { stdio: 'inherit' },
  );
}
