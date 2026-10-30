import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { plugin } from 'bun';
import { afterEach, mock } from 'bun:test';

// Preloaded, because Bun links CommonJS dependencies (react-dom, Testing Library) before any test file's body runs.
GlobalRegistrator.register({ url: 'http://localhost:3000/' });

const { cleanup } = await import('@testing-library/react');
const { installMatchMedia, resetViewport } = await import('./media');
const { scssVariables } = await import('./scssVariables');

await mock.module('@/styles/variables.module.scss', () => ({ default: scssVariables }));

plugin({
  name: 'svg-component',
  setup(build) {
    build.onLoad({ filter: /\.svg$/ }, ({ path }) => ({
      contents: `
        import { createElement } from 'react';

        export default function SvgIcon(props) {
          return createElement('svg', { 'data-icon': ${JSON.stringify(path.split('/').at(-1))}, ...props });
        }
      `,
      loader: 'js',
    }));
  },
});

installMatchMedia();

function rejectNetworkRequest(): Promise<never> {
  return Promise.reject(new Error('Tests must not reach the network'));
}

globalThis.fetch = rejectNetworkRequest as unknown as typeof fetch;
window.fetch = globalThis.fetch;

// `Modal` looks for the Next.js root as soon as it is imported.
document.body.innerHTML = '<div id="__next"></div>';

// Floating UI writes positions from a promise, which no test can wrap in act().
const consoleError = console.error; // oxlint-disable-line no-console

// oxlint-disable-next-line no-console
console.error = (...parameters: unknown[]) => {
  if (!String(parameters[0]).includes('not wrapped in act(')) {
    consoleError(...parameters);
  }
};

afterEach(() => {
  cleanup();
  resetViewport();
  window.localStorage.clear();
});
