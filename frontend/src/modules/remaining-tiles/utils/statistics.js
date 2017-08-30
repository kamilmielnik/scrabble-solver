export const reduceCellStatistics = (charactersStatistics, cell) => {
  const character = !cell.isEmpty && cell.hasTile() && !cell.tile.isBlank && cell.tile.character;
  const characterStatistics = charactersStatistics[character];
  if(characterStatistics) {
    return incrementUsedCount(charactersStatistics, character);
  }
  return charactersStatistics;
};

export const incrementUsedCount = (charactersStatistics, character) => ({
  ...charactersStatistics,
  [character]: {
    ...charactersStatistics[character],
    usedCount: charactersStatistics[character].usedCount + 1
  }
});

export const getNumberOfRemainingCharacters = (charactersStatistics) => Object.values(charactersStatistics).reduce(
  (numberOfRemainingCharacters, { count, usedCount }) => numberOfRemainingCharacters + count - usedCount,
  0
);
