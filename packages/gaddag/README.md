# @scrabble-solver/gaddag

A [GADDAG](https://en.wikipedia.org/wiki/GADDAG) ([Gordon, 1994](https://ericsink.com/downloads/faster-scrabble-gordon.pdf)) implementation powering the Scrabble Solver.

For every word `w` and every split point `s` the automaton contains `reverse(w[0..s)) + ◇ + w[s..)`, which lets the solver extend words in both directions from any anchor cell. The automaton is minimized (shared prefixes and suffixes), stored in flat typed arrays, and serializes to a compact binary format.

- `buildGaddag(words)` — builds a minimal GADDAG from a word list (radix-sorted sequences fed to an incremental minimal-automaton builder).
- `gaddag.has(word)` / `gaddag.hasPrefix(prefix)` — dictionary lookups.
- `gaddag.getArc(ref, letter)` / `gaddag.rootRef` — raw automaton traversal used by the move generator.
- `gaddag.serialize()` / `Gaddag.deserialize(bytes)` — binary round-trip.
