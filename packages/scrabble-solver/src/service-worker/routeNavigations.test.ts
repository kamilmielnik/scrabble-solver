import { describe, expect, it, mock } from 'bun:test';

import type * as appShellModule from './appShell';

const registered: unknown[] = [];

class FakeNavigationRoute {
  public readonly handler: unknown;

  public readonly options: { denylist: RegExp[] };

  constructor(handler: unknown, options: { denylist: RegExp[] }) {
    this.handler = handler;
    this.options = options;
  }
}

await mock.module('workbox-routing', () => ({
  NavigationRoute: FakeNavigationRoute,
  registerRoute: (route: unknown) => registered.push(route),
}));

const { respondToNavigation, routeNavigations }: typeof appShellModule = await import('./appShell');

describe('routeNavigations', () => {
  it('answers navigations with the shell handler, never API routes', () => {
    routeNavigations();

    const route = registered[0] as FakeNavigationRoute;

    expect(route).toBeInstanceOf(FakeNavigationRoute);
    expect(route.handler).toBe(respondToNavigation);
    expect(route.options.denylist.some((pattern) => pattern.test('/api/solve'))).toBe(true);
    expect(route.options.denylist.some((pattern) => pattern.test('/'))).toBe(false);
  });
});
