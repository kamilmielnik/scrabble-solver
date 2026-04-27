# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is a Bun-workspaces monorepo (managed with Lerna for versioning/publishing and Nx purely for build caching/ordering). Bun >=1.3 (and Node.js >=24 for runtime compatibility) is required.

The nine packages live under `packages/` and have a strict dependency order. When something breaks "downstream" of where you edited, rebuild the upstream package first:

```
constants → types → configs ──┐
                              ├──→ dictionaries → solver → scrabble-solver (Next.js app)
word-lists ───────────────────┤
word-definitions ─────────────┘
logger (independent, used by app + dictionaries)
```

- `solver` — pure word-finding engine. Given a `Trie`, `Config`, `Board`, and `Tile[]`, returns scored `Result`s. Has no I/O. Pipeline is `generatePatterns → fillPattern (per pattern) → areDigraphsValid (only when `config.twoCharacterTiles` is non-empty) → getUniquePatterns → getPatternScore`. New solving rules belong in this pipeline; `solve.ts` itself is just orchestration.
- `dictionaries` — downloads/caches per-locale word lists to `$HOME/.scrabble-solver/dictionaries` and exposes them as `Trie`s. The `Dictionaries` class layers a `MemoryCache` over a `DiskCache` (`LayeredCache`) and uses a per-locale `createAsyncProxy` to coalesce concurrent downloads. Cache entries older than `CACHE_STALE_THRESHOLD` (1 day) are refreshed on access. Only this package and `logger` perform filesystem I/O — keep other packages pure so they can run in Edge / browser contexts.
- `word-lists` — pulls raw word lists from upstream sources (one fetcher per locale in `src/languages/`). Used by `dictionaries` during downloads.
- `word-definitions` — per-locale `crawl(word) → string` and a parser for each source (Merriam-Webster, CNRTL, DWDS, SJP, dexonline, vajehyab, etc.). Add a new locale by adding a `crawl` and a `parse` function in `src/languages/` and wiring them into `crawl.ts` / `parse.ts`. `parse.test.ts` is where you add fixture-based parser tests.
- `types` — domain model classes (`Board`, `Cell`, `Tile`, `Pattern`, `Result`, `Config`, `Locale`, …) plus `*Json` shapes. Most of these have a `fromJson` / `toJson` round-trip — use them at the wire boundary instead of hand-rolled serialization.
- `configs` — split into **games** (`scrabble`, `superScrabble`, `scrabbleDuel`, `letterLeague`, `crossplay`, `literaki`, `kelimelik` — each defines board size, bonuses, rack size, blanks count, bingo bonus) and **languages** (`english`, `french`, …, each spreads a base game config and overrides `locale` + `tiles`). A locale config is one game × one language; e.g. `polishScrabble` = `scrabble` ⊕ Polish tiles + digraphs. Adding a language means a new config here **and** the 15-step checklist under "Add a new language" in `README.md`.
- `logger` — Winston logger writing JSON to `$HOME/.scrabble-solver/logs/{all,error}.log`. Only `error` goes to console. Used server-side by the app + dictionaries; do **not** import from browser code.
- `constants` — shared primitives (`BLANK`, `BONUS_CHARACTER`, `BONUS_WORD`, …). No runtime dependencies.

### App package (`@scrabble-solver/scrabble-solver`)

- **Routing**: Next.js Pages Router (`src/pages/`). API routes: `solve`, `verify`, `visit`, `dictionary/[locale]/[word]`. The path alias `@/*` resolves to `src/*` (set in `tsconfig.json`).
- **State**: Redux Toolkit + Redux-Saga. Slices in `src/state/{board,cellFilters,dictionary,rack,results,settings,solve,verify}`, each exporting `<name>Slice` (reducer + actions) and selectors. The root saga in `state/sagas.ts` reacts to slice actions: `submit` → call SDK → write results back. `solve`, `verify`, and `dictionary` use `takeLatest` (only the latest in-flight request resolves); cell/rack edits use `takeEvery`. State is intentionally **not** serializable-checked (`serializableCheck: false`) because slices hold class instances (`Board`, `Tile`).
- **SDK layer (`src/sdk/`)**: thin browser/server clients for the four API routes. `findWordDefinitions` is memoized at the saga level via `lib/memoize`. Always go through SDK — never `fetch` directly from a saga or component.
- **Persistence**: settings, board, and rack persist to `localStorage` via `store2` under the `scrabble-solver` namespace (`state/localStorage.ts`). When changing settings shape, add a migration block (look at `migrateLegacySettings` for the pattern) — note the dated comment with introduction date and life expectancy.
- **Service worker**: built by `WorkboxPlugin.InjectManifest` from `src/service-worker/index.ts` to `public/service-worker.js`. It precaches the app shell and intercepts `/api/solve` and `/api/verify` requests so the app can still solve offline once a dictionary is cached. Only generated in production builds (`!isServer && !dev`).
- **i18n**: `src/i18n/languages/<lang>.json` (8 languages). The `LOCALE_FEATURES` map gates per-locale capabilities. `useTranslate()` is the hook for translations.
- **Styling**: SCSS modules with a shared design-token system. SCSS tokens live in `src/styles/_tokens.scss`; the same values are re-exported to TS via `:export` in `variables.module.scss` (imported in JS as a module). Update `_tokens.scss` first; the `.module.scss` file then exposes the value to JS. Responsive helpers come from `include-media`.
- **SVGs**: imported as React components via `@svgr/webpack` (configured in `next.config.js`).

## Common commands

All commands run from the repo root unless noted.

| Task | Command |
| --- | --- |
| Install + build everything | `bun install && bun run build` |
| Build all packages | `bun run build` (Nx-cached, respects dep order) |
| Build one package | `bun run --filter @scrabble-solver/<name> build` |
| Dev server (port 3000) | `bun run dev` |
| Production server (port 3333) | `bun start` |
| Lint | `bun run lint` (oxlint) / `bun run lint:fix` |
| Format check / fix | `bun run format` / `bun run format:fix` (oxfmt) |
| Type-check the app | `bun run --filter @scrabble-solver/scrabble-solver type-check` (uses `tsgo`, the TypeScript native preview) |
| Unit tests (all workspaces) | `bun run test-unit` |
| Unit tests (one package) | `bun run --filter @scrabble-solver/solver test` |
| One unit test file | `cd packages/solver && bun test src/solve.test.ts` |
| One unit test by name | `cd packages/solver && bun test -t "pattern"` |
| Cypress (interactive) | `bun run test-cypress` (expects dev server on :3000) |
| Cypress (headless) | `bun run test-cypress:run` (expects server on :3333) |
| Full test pipeline | `bun run test` (build → unit → start app → cypress) — note: `bun test` invokes Bun's built-in test runner, not this script |

Hot reload only works for the `scrabble-solver` package. Edits to any other package require rebuilding that package before the app picks them up.

## Testing notes

- Unit tests run on **Bun's test runner**, not Jest. The API is Jest-compatible (`describe`/`it`/`expect`), which is why the oxlint config still loads the `jest` plugin for rules like `no-focused-tests`.
- Only `solver`, `word-definitions`, and `scrabble-solver` have a `test` script. Tests are auto-discovered under `src/` matching `*.test.ts(x)`. The 180s timeout is needed because some solver tests build a real `Trie` from a downloaded dictionary.
- `bunfig.toml` + `bun.test.preload.ts` register a SCSS loader stub (returns a `Proxy` whose keys are their own names) so component tests can import `*.scss` modules without a real compiler. If you add other non-JS imports to test-touched code (images, etc.), extend the preload.
- Each package's `tsconfig.json` excludes `**/*.test.ts` from the build output. Tests are not part of published packages.
- Cypress: tests in `cypress/e2e/`. Custom command setup in `cypress/support/commands.ts` (registers `@testing-library/cypress` and `cypress-real-events`). Two base URLs are in play: `cypress.config.ts` defaults to `http://localhost:3000` (matches `bun run dev`); `test-cypress:run` and CI override to `:3333` (matches `bun start`). Pick the script that matches the server you're actually running.

## Tooling specifics

- **Linting**: `oxlint` (Rust-based ESLint replacement) configured in `.oxlintrc.json`. Type-aware rules require `oxlint-tsgolint`. Adding a new top-level JS config file usually means adding it to `ignorePatterns`. The oxlint config still loads the `jest` plugin and `jest` global because Bun's test runner mirrors the Jest API; do not remove them.
- **Formatting**: `oxfmt` covers `*.{js,ts,tsx,scss}`.
- **TypeScript**: the app uses `tsgo` (`@typescript/native-preview`) for `type-check` and `next build`. Plain `tsc` is not used in app builds. Root `tsconfig.json` sets `types: ["bun"]` for global test-runner types; library packages extend it and exclude `cypress` and `**/*.test.ts` from emitted output.
- **Next.js**: built with `--webpack` flag explicitly (the default Turbopack is intentionally not used). `next.config.js` registers `@svgr/webpack` for SVG-as-component imports and the Workbox `InjectManifest` plugin for the service worker. SCSS load paths are extended to `./src` and `node_modules/include-media/dist`.
- **Nx**: `nx.json` only defines a `build` target with `dependsOn: ["^build"]` and `cache: true`. It is used purely for dependency-aware build ordering and caching — there are no Nx generators or executors.

## CI workflows

`.github/workflows/`:

- `build.yml` — `bun install --frozen-lockfile && bun run build`.
- `unit-tests.yml` — `bun run build && bun run test-unit`.
- `e2e-tests.yml` — Cypress against `bun start` on :3333. Uploads screenshots on failure.
- `oxlint.yml` / `oxfmt.yml` — lint and format-check.
- `npx.yml` — runs daily and on PR. Installs the latest published `scrabble-solver` from npm via `npm install --global`, runs Cypress against it. Catches packaging regressions in the `bin/scrabble-solver.js` launcher.
- `deploy.yml` — `workflow_dispatch` only. SSHs into prod, pulls, builds, restarts `scrabble-solver.service`.

When adding a workflow, match the existing pattern: trigger on `push`/`pull_request` to `master`, use `actions/checkout@v6` and `oven-sh/setup-bun@v2`, install with `bun install --frozen-lockfile`.

## Versioning & publishing

`bun run release` chains `reinstall → version:bump → np → lerna publish from-package`. `version:bump` runs `lerna version --force-publish` (bumps every package in lockstep) followed by `bump-version.js` to sync any other version references, then commits. Don't hand-edit `version` fields across packages — use the script.

## Deploys

The `Deploy` GitHub workflow (`workflow_dispatch` only) SSHs into the production host, pulls the chosen branch, runs `bun install && bun run build`, and restarts `scrabble-solver.service` via `systemctl`. There's no separate staging environment.

## Runtime data

The app reads/writes user data outside the project directory:

- `$HOME/.scrabble-solver/dictionaries/` — cached `Trie`s, one per locale, refreshed when older than 1 day.
- `$HOME/.scrabble-solver/logs/{all,error}.log` — Winston JSON logs.

The `npx scrabble-solver@latest` entry point (`bin/scrabble-solver.js`) just `cd`s to the package root and runs `npm start`. The app then serves on http://localhost:3333.
