import { render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';
import { type AppProps } from 'next/app';
import { type PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';

import type * as pages_appModule from '../../pages/_app';
import type * as notFoundModule from '../../pages/not-found';
import type * as parametersModule from '../../parameters';

await mock.module('next/head', () => ({
  default: ({ children }: PropsWithChildren) => <div data-testid="head">{children}</div>,
}));

const { default: App }: typeof pages_appModule = await import('../../pages/_app');
const { default: NotFoundPage }: typeof notFoundModule = await import('../../pages/not-found');
const { SITE_DESCRIPTION, SITE_URL }: typeof parametersModule = await import('../../parameters');

describe('_app', () => {
  it('renders the page with store access and its props', () => {
    function Page({ greeting }: { greeting: string }) {
      const version = useSelector((state: { app: { version: string } }) => state.app.version);

      return <p>{`${greeting}${version}`}</p>;
    }

    renderApp(Page, '/', { greeting: 'hello' });

    expect(screen.getByText('hello')).toBeDefined();
  });

  it('marks the home page as canonical and indexable', () => {
    renderApp(() => null, '/');

    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`${SITE_URL}/`);
    expect(document.querySelector('meta[name="robots"]')).toBeNull();
  });

  it('keeps other pages out of the index', () => {
    renderApp(() => null, '/not-found');

    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex');
  });

  it('describes the page for search engines and social cards', () => {
    renderApp(() => null, '/');

    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(SITE_DESCRIPTION);
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(`${SITE_URL}/og.png`);
    expect(document.querySelector('title')?.textContent).toContain('Scrabble Solver 2');
  });
});

describe('not-found', () => {
  it('shows the 404 tiles and its title', () => {
    render(<NotFoundPage />);

    expect(document.querySelector('title')?.textContent).toBe('Page not found - Scrabble Solver');
    expect(document.querySelector('a[href="/"]')).not.toBeNull();
  });
});

function renderApp(Component: AppProps['Component'], pathname: string, pageProps: object = {}) {
  const router = { pathname } as AppProps['router'];

  return render(<App Component={Component} pageProps={pageProps} router={router} />);
}
