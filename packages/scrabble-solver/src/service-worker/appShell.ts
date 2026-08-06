import { NavigationRoute, registerRoute } from 'workbox-routing';

const APP_SHELL_CACHE = 'app-shell';
const APP_SHELL_URL = '/';

/**
 * Caching the shell on install instead of on navigation pins it to the same build
 * as the chunks precached alongside it, and covers the first visit, whose
 * navigation happens before this worker controls the page.
 */
export async function cacheAppShell(): Promise<void> {
  const cache = await caches.open(APP_SHELL_CACHE);
  await cache.add(APP_SHELL_URL);
}

export function routeNavigations(): void {
  registerRoute(new NavigationRoute(respondToNavigation, { denylist: [/^\/api\//] }));
}

/**
 * A deploy has to reach online users on their next navigation (see the revalidation
 * headers in next.config.js), so the shell only stands in when the network is gone.
 * Solving keeps working from there, off the dictionary the solver worker holds in
 * the Cache API.
 */
export async function respondToNavigation({ request }: { request: Request }): Promise<Response> {
  try {
    return await fetch(request);
  } catch (error) {
    const cache = await caches.open(APP_SHELL_CACHE);
    const appShell = await cache.match(APP_SHELL_URL);

    if (!appShell) {
      throw error;
    }

    return appShell;
  }
}
