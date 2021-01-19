import { WordDefinition } from '@scrabble-solver/types';

const translateFr = async (word: string): Promise<WordDefinition> => {
  const wordDefinition = new WordDefinition({
    // Not implemented yet
    definitions: ['Définition dictionaire pas encore implémenté'],
    isAllowed: true,
    word,
  });

  return wordDefinition;
};

export default translateFr;
