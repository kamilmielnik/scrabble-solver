import { games, hasConfig, languages } from '@scrabble-solver/configs';
import { Locale } from '@scrabble-solver/types';

export const getOptions = (locale: Locale) => {
  const gameConfigs = Object.values(games);
  const languageConfigs = Object.values(languages);

  return gameConfigs.map((gameConfig) => {
    const languageConfig = languageConfigs.find((config) => {
      return config.game === gameConfig.game && config.locale === locale;
    });

    return {
      disabled: !hasConfig(gameConfig.game, locale),
      label: languageConfig?.config.name ?? gameConfig.name,
      value: gameConfig.game,
    };
  });
};
