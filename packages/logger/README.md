# @scrabble-solver/logger

Server-side event log. Every request the app serves and every dictionary build appends one line to

```
$HOME/.scrabble-solver/logs/events.txt
```

Each line is a flat JSON object: `timestamp` (UTC, `YYYY-MM-DDTHH:mm:ssZ`), `type`, then the fields declared for that type in [`src/events.ts`](src/events.ts), in that order. Fields whose value is unknown are omitted. The file is append-only and never rotated; the CSV files below are derived from it and can be regenerated at any time.

```
{"timestamp":"2026-08-23T02:09:02Z","type":"visit","ip":"203.0.113.7","ua":"Mozilla/5.0 …","referrer":"https://www.google.com/","locale":"en-US","game":"scrabble"}
{"timestamp":"2026-08-23T02:09:05Z","type":"solve","ip":"203.0.113.7","ms":14,"locale":"en-US","game":"scrabble","tiles":61,"blanks":4,"rack":"pz cvmt","board":"|||||             wriest|                 w","results":312}
{"timestamp":"2026-08-23T02:09:07Z","type":"error","level":"error","operation":"verify","ip":"203.0.113.7","ua":"…","message":"Error: Invalid \"board\" parameter","stack":"Error: Invalid …\n    at parseRequest …","input":"{\"locale\":\"en-US\",\"game\":\"scrabble\",\"board\":[[…"}
```

## Events

| `type`         | fields                                                    | one entry per                                                                                                                                                                                                       |
| -------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `visit`        | `ip, ua, referrer, locale, game`                          | `PUT /api/visit` - the page-load ping; `referrer` is the browser's `document.referrer`                                                                                                                              |
| `solve`        | `ip, ms, locale, game, tiles, blanks, rack, board, results` | successful `/api/solve`; `results` is the number of moves found                                                                                                                                                     |
| `verification` | `ip, ms, locale, game, tiles, blanks, board, valid, invalid` | successful `/api/verify`; counts of valid and invalid words on the board                                                                                                                                            |
| `download`     | `ip, ms, locale, status, encoding, bytes`                 | `/api/dictionary/[locale]` (the binary GADDAG); `status` is 200 or 304, `encoding` `gzip` or `identity`, `bytes` what went over the wire (0 on 304)                                                                 |
| `definition`   | `ip, ms, locale, word, found`                             | **word** looked up through `/api/dictionary/[locale]/[word]`; `ms` is the whole request's                                                                                                                           |
| `build`        | `locale, words, download_ms, build_ms`                    | GADDAG built from a freshly downloaded word list                                                                                                                                                                    |
| `error`        | `level, operation, locale, ip, ua, message, stack, input` | failed request (`level` `error`, `operation` is the route, `input` the first 1 KB of the request body or query, its smallest fields first), failed build (`operation` `build`), or a cached dictionary that had to be rebuilt (`level` `warn`, `operation` `cache`) |

- `ip` is the last hop of `x-forwarded-for` (Next.js fills the header in from the socket when there is no proxy; nginx appends the real client behind one), with the `::ffff:` IPv4-mapping prefix stripped. Only trustworthy behind a single proxy, which is how production runs.
- `ua` (the user agent) is recorded on visits and errors only.
- `board` is `Board.toString()` with rows right-trimmed, trailing empty rows dropped and rows joined with `|`. `rack` is the rack's characters, a blank being a space.
- Requests that fail inside a route produce only an `error` event, so every other type describes a successful request. Requests Next.js rejects before the route runs (malformed JSON, oversized bodies) produce no event at all.

`logEvent()` appends synchronously and is silent under `bun test`. `logError()` writes an `error` event and mirrors it to stderr - besides a line when the events file itself cannot be appended, the only thing this package prints. Do **not** import it from browser code.

## Export to CSV (Metabase)

```shell
bun run --filter @scrabble-solver/logger export        # every year
bun run --filter @scrabble-solver/logger export 2026   # one year
```

writes one RFC 4180 file per type and year to `$HOME/.scrabble-solver/csv/`:

```
builds-2026.csv  definitions-2026.csv  downloads-2026.csv  errors-2026.csv
solves-2026.csv  verifications-2026.csv  visits-2026.csv
```

The header is `timestamp` followed by the type's fields; empty cells are absent fields. Upload a year's file to Metabase to create a model, **Replace** its data with each fresh export of that year, and **Append** the next year's file once it starts. Metabase requires identical column names, order and types for appends and replacements, which is why `EVENT_FIELDS` in `src/events.ts` is append-only: a new field means a new Metabase model. Metabase accepts files up to 50 MB, a few hundred thousand rows of the busiest types.

## Stats

```shell
bun run --filter @scrabble-solver/logger stats            # per-day counts of every type
bun run --filter @scrabble-solver/logger stats 2026-08-01 # since a day
```

Or straight from the file:

```shell
jq -c 'select(.type == "solve") | .results' ~/.scrabble-solver/logs/events.txt
jq -r .type ~/.scrabble-solver/logs/events.txt | sort | uniq -c
```

## Previous format

Before August 2026 the package wrote pretty-printed winston output to `all.log` and `error.log` in the same directory. Those files are neither read nor written anymore and can be deleted.
