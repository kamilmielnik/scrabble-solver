import { type APIRequestContext, expect, test } from '@playwright/test';

import * as Lib from '../lib';

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
const PNG_WIDTH_OFFSET = 16;
const PNG_HEIGHT_OFFSET = 20;

test.describe('Served document', () => {
  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('still shows the styled board, rack and navigation', async ({ page }) => {
      await Lib.visitIndex(page);

      await expect(page.getByRole('navigation')).toBeVisible();
      await expect(Lib.getBoardContainer(page).getByRole('textbox', { includeHidden: true })).toHaveCount(225);
      await expect(Lib.getRackContainer(page).getByRole('textbox', { includeHidden: true })).toHaveCount(7);
      await expect(Lib.getBoardContainer(page)).toHaveCSS('display', 'grid');
    });
  });

  test('inlines the stylesheets of the page, so that no CSS request can block rendering', async ({ request }) => {
    const html = await (await request.get('/')).text();

    expect(html).not.toContain('rel="stylesheet"');
    expect(html).toContain('<style data-href=');
  });

  test('describes the page to search engines and social networks', async ({ page }) => {
    await Lib.visitIndex(page);

    await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', /width=device-width/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://scrabble-solver.org/');
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://scrabble-solver.org/og.png',
    );
  });

  test('embeds valid structured data', async ({ page }) => {
    await Lib.visitIndex(page);

    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();

    expect(JSON.parse(jsonLd ?? '')).toMatchObject({ '@type': 'WebApplication', name: 'Scrabble Solver' });
  });

  test('resolves every icon, tile image and manifest linked from the head', async ({ page, request }) => {
    await Lib.visitIndex(page);

    const hrefs = await page.locator('head link[href^="/"]').evaluateAll((links) => {
      return links.map((link) => link.getAttribute('href') ?? '');
    });
    const tileImages = await page.locator('head meta[content^="/icons/"]').evaluateAll((metas) => {
      return metas.map((meta) => meta.getAttribute('content') ?? '');
    });

    expect(hrefs.length).toBeGreaterThan(10);
    expect(await findMissingPaths(request, [...hrefs, ...tileImages])).toEqual([]);
  });

  test('resolves every icon of the web app manifest', async ({ request }) => {
    const response = await request.get('/site.webmanifest');
    const manifest = (await response.json()) as { icons: { src: string }[]; start_url: string };

    expect(await findMissingPaths(request, [manifest.start_url, ...manifest.icons.map(({ src }) => src)])).toEqual([]);
  });

  test('serves the social image in the size the page declares', async ({ request }) => {
    const image = await (await request.get('/og.png')).body();

    expect(image.readUInt32BE(PNG_WIDTH_OFFSET)).toBe(OG_IMAGE_WIDTH);
    expect(image.readUInt32BE(PNG_HEIGHT_OFFSET)).toBe(OG_IMAGE_HEIGHT);
  });

  test('keeps crawlers out of the API and points them to the sitemap', async ({ request }) => {
    const robots = await (await request.get('/robots.txt')).text();
    const sitemap = await (await request.get('/sitemap.xml')).text();

    expect(robots).toContain('Disallow: /api/');
    expect(robots).toContain('Sitemap: https://scrabble-solver.org/sitemap.xml');
    expect(sitemap).toContain('<loc>https://scrabble-solver.org/</loc>');
  });

  test('serves the description for language models', async ({ request }) => {
    const response = await request.get('/llms.txt');

    expect(response.headers()['content-type']).toContain('text/plain');
    expect(await response.text()).toContain('# Scrabble Solver');
  });

  test('makes browsers revalidate the page, answering 304 while the build stays the same', async ({ request }) => {
    const response = await request.get('/');
    const etag = response.headers().etag;
    const revalidation = await request.get('/', { headers: { 'If-None-Match': etag } });

    expect(response.headers()['cache-control']).toBe('public, max-age=0, must-revalidate');
    expect(revalidation.status()).toBe(304);
  });

  test('caches hashed chunks forever, because a new build gets new file names', async ({ page, request }) => {
    await Lib.visitIndex(page);

    const chunk = await page.locator('script[src*="/_next/static/chunks/"]').first().getAttribute('src');
    const response = await request.get(chunk ?? '');

    expect(response.headers()['cache-control']).toContain('immutable');
  });

  test.describe('not found', () => {
    test('keeps the not-found page out of search results and links back to the app', async ({ page }) => {
      await page.goto('/not-found');

      await expect(page).toHaveTitle('Page not found - Scrabble Solver');
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);

      await page.getByRole('link').click();

      await expect(Lib.getBoardContainer(page)).toBeVisible();
    });

    test('answers 404 for an unknown path', async ({ request }) => {
      expect((await request.get('/no-such-page')).status()).toBe(404);
      expect((await request.get('/api/no-such-route')).status()).toBe(404);
    });

    test.fixme('shows the app-branded page for an unknown path', async ({ page }) => {
      await page.goto('/no-such-page');

      await expect(page).toHaveTitle('Page not found - Scrabble Solver');
    });

    test.fixme('answers 404, not 200, on the not-found page itself', async ({ request }) => {
      expect((await request.get('/not-found')).status()).toBe(404);
    });
  });
});

async function findMissingPaths(request: APIRequestContext, paths: string[]): Promise<string[]> {
  const statuses = await Promise.all(paths.map(async (path) => (await request.get(path)).status()));

  return paths.filter((_path, index) => statuses[index] !== 200);
}
