# @scrabble-solver/solver

![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)

The brains of Scrabble Solver.

## Benchmarks

`solve()` speed for a mid-game Scrabble position in English (US), English (GB), and Polish, grouped by the number of blank tiles on the rack.

Rerun the benchmarks and refresh the results below with:

```sh
bun run benchmark
```

<!-- benchmark-results:start -->

![Median solve() duration grouped by number of blanks on the rack](benchmarks/results/chart.svg)

| Blanks | English (US) | English (GB) | Polish |
| --- | --- | --- | --- |
| 0 | 6 ms (1,559 results) | 5 ms (2,398 results) | 4 ms (1,826 results) |
| 1 | 31 ms (7,546 results) | 36 ms (11,680 results) | 31 ms (15,289 results) |
| 2 | 110 ms (25,659 results) | 124 ms (39,286 results) | 161 ms (70,691 results) |

Median of 5 runs (after 5 warmup runs)

<!-- benchmark-results:end -->
