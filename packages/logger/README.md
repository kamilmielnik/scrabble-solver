# @scrabble-solver/logger

Logger used server-side.

```
$HOME/.scrabble-solver/logs/events.txt
```

## Export to CSV

```shell
bun run --filter @scrabble-solver/logger export        # every year
bun run --filter @scrabble-solver/logger export 2026   # one year
```

writes one file per event type and year to `$HOME/.scrabble-solver/csv/<type>-YYYY.csv`, e.g. `visit-2026.csv`.

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

Before August 2026 the package wrote output to `all.log` and `error.log` in the same directory.
Those files are neither read nor written anymore and can be deleted.
