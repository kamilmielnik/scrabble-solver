# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is an npm-workspaces monorepo (managed with Lerna for versioning/publishing and Nx purely for build caching/ordering). Node.js >=24 is required.

The nine packages live under `packages/` and have a strict dependency order. When something breaks "downstream" of where you edited, rebuild the upstream package first:

```
constants → types → configs ──┐
                              ├──→ dictionaries → solver → scrabble-solver (Next.js app)
word-lists ───────────────────┤
word-definitions ─────────────┘
logger (independent, used by app + dictionaries)
```

- `solver` — pure word-finding engine. Given a `Trie`, `Config`, `Board`, and `Tile[]`, returns scored `Result`s. Has no I/O.
- `dictionaries` — downloads/caches per-locale word lists to `$HOME/.scrabble-solver/dictionaries` and exposes them as `Trie`s.
- `scrabble-solver` — the Next.js app. Exposes `/api/solve`, `/api/verify`, `/api/dictionary`, `/api/visit`. State is Redux Toolkit + Redux-Saga (slices in `src/state/{board,cellFilters,dictionary,rack,results,settings,solve,verify}`). i18n covers 8 languages in `src/i18n/languages/`.
- `configs` — per-locale game rules (board size, bonuses, tile distributions, two-character tiles for digraph languages, etc.). Adding a language means adding a config here plus everything in step (8) of `README.md`'s "Add a new language" checklist.

## Common commands

All commands run from the repo root unless noted.

| Task | Command |
| --- | --- |
| Install + build everything | `npm install && npm run build` |
| Build all packages | `npm run build` (Nx-cached, respects dep order) |
| Build one package | `npm run build -w @scrabble-solver/<name>` |
| Dev server (port 3000) | `npm run dev` |
| Production server (port 3333) | `npm start` |
| Lint | `npm run lint` (oxlint) / `npm run lint:fix` |
| Format check / fix | `npm run format` / `npm run format:fix` (oxfmt) |
| Type-check the app | `npm run type-check -w @scrabble-solver/scrabble-solver` (uses `tsgo`, the TypeScript native preview) |
| Unit tests (all workspaces) | `npm run test-unit` |
| Unit tests (one package) | `npm test -w @scrabble-solver/solver` |
| One unit test file | `cd packages/solver && bun test src/solve.test.ts` |
| One unit test by name | `cd packages/solver && bun test -t "pattern"` |
| Cypress (interactive) | `npm run test-cypress` (expects dev server on :3000) |
| Cypress (headless) | `npm run test-cypress:run` (expects server on :3333) |
| Full test pipeline | `npm test` (build → unit → start app → cypress) |

Hot reload only works for the `scrabble-solver` package. Edits to any other package require rebuilding that package before the app picks them up.

## Testing notes

- Unit tests run on **Bun's test runner**, not Jest. The API is Jest-compatible (`describe`/`it`/`expect`), which is why the oxlint config still loads the `jest` plugin for rules like `no-focused-tests`.
- Only `solver`, `word-definitions`, and `scrabble-solver` have a `test` script. New unit tests in those packages are auto-discovered (`bun test ... src`).
- `bunfig.toml` + `bun.test.preload.ts` register a SCSS loader stub so component tests can import `*.scss` modules without a real compiler.
- Cypress uses two different base URLs: `cypress.config.ts` defaults to `http://localhost:3000` (matches `npm run dev`); `test-cypress:run` and CI override to `:3333` (matches `npm start`). Pick the script that matches the server you're actually running.

## Tooling specifics

- **Linting**: `oxlint` (Rust-based ESLint replacement) configured in `.oxlintrc.json`. Type-aware rules require `oxlint-tsgolint`. Adding a new top-level JS config file usually means adding it to `ignorePatterns`.
- **Formatting**: `oxfmt` covers `*.{js,ts,tsx,scss}`.
- **TypeScript**: the app uses `tsgo` (`@typescript/native-preview`) for `type-check` and `next build`. Plain `tsc` is not used in app builds.
- **Next.js**: built with `--webpack` flag explicitly (the default Turbopack is intentionally not used).

## Versioning & publishing

`npm run release` chains `reinstall → version:bump → np → lerna publish from-package`. `version:bump` runs `lerna version --force-publish` (bumps every package in lockstep) followed by `bump-version.js` to sync any other version references, then commits. Don't hand-edit `version` fields across packages — use the script.

## Deploys

The `Deploy` GitHub workflow (`workflow_dispatch` only) SSHs into the production host, pulls the chosen branch, runs `npm install && npm run build`, and restarts `scrabble-solver.service` via `systemctl`. There's no separate staging environment.
